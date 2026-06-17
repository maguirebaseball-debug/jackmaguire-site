#!/usr/bin/env python3
"""
PCA and clustering analysis of localnotion database.
Extracts page content, vectorizes with TF-IDF, applies PCA and KMeans clustering.
"""
import sqlite3
import json
import sys
from pathlib import Path
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.decomposition import PCA
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import matplotlib.pyplot as plt
import seaborn as sns
from collections import Counter
import pandas as pd

DB_PATH = "/Users/jackmaguire/Developer/jackmaguire-distribution/notion.db"

def extract_page_content(page_id, cursor):
    """Extract all text content from a page and its blocks."""
    cursor.execute("SELECT properties FROM pages WHERE id = ?", (page_id,))
    page_row = cursor.fetchone()

    title = "Untitled"
    if page_row:
        try:
            props = json.loads(page_row[0])
            for p in props.values():
                if p.get('type') == 'title':
                    title_bits = p.get('title', [])
                    if title_bits:
                        title = "".join([t.get('plain_text', '') for t in title_bits])
        except:
            pass

    # Get all blocks for this page
    cursor.execute("SELECT block_type, type_data FROM blocks WHERE parent_id = ? ORDER BY child_index", (page_id,))
    content_parts = [title]

    for row in cursor.fetchall():
        b_type = row[0]
        try:
            data = json.loads(row[1])
            if b_type in data:
                block_content = data[b_type]
                if 'rich_text' in block_content:
                    text = "".join([t.get('plain_text', '') for t in block_content['rich_text']])
                    if text.strip():
                        content_parts.append(text)
        except:
            pass

    return title, " ".join(content_parts)

def load_all_pages():
    """Load all pages from the database."""
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    cursor.execute("SELECT id FROM pages")
    page_ids = [row[0] for row in cursor.fetchall()]

    pages = []
    for page_id in page_ids:
        title, content = extract_page_content(page_id, cursor)
        if content.strip() and len(content) > 10:  # Filter out empty pages
            pages.append({
                'id': page_id,
                'title': title,
                'content': content,
                'char_count': len(content),
                'word_count': len(content.split())
            })

    conn.close()
    return pages

def perform_analysis(pages):
    """Perform PCA and clustering analysis."""
    print(f"Loaded {len(pages)} pages with content")

    # Extract texts for vectorization
    texts = [p['content'] for p in pages]
    titles = [p['title'] for p in pages]

    # Vectorize using TF-IDF
    print("Vectorizing text with TF-IDF...")
    vectorizer = TfidfVectorizer(
        max_features=200,
        min_df=2,
        max_df=0.8,
        stop_words='english',
        ngram_range=(1, 2)
    )
    tfidf_matrix = vectorizer.fit_transform(texts)
    print(f"TF-IDF matrix shape: {tfidf_matrix.shape}")

    # Convert to dense for PCA
    X = tfidf_matrix.toarray()

    # Apply PCA
    print("\nApplying PCA...")
    pca = PCA(n_components=2)
    X_pca = pca.fit_transform(X)
    print(f"PCA explained variance ratio: {pca.explained_variance_ratio_}")
    print(f"Total variance explained by 2 components: {sum(pca.explained_variance_ratio_):.2%}")

    # Determine optimal number of clusters using elbow method
    print("\nDetermining optimal number of clusters...")
    inertias = []
    silhouette_scores = []
    K_range = range(2, min(11, len(pages) // 5))

    from sklearn.metrics import silhouette_score

    for k in K_range:
        kmeans = KMeans(n_clusters=k, random_state=42, n_init=10)
        kmeans.fit(X)
        inertias.append(kmeans.inertia_)
        sil_score = silhouette_score(X, kmeans.labels_)
        silhouette_scores.append(sil_score)
        print(f"  K={k}: inertia={kmeans.inertia_:.2f}, silhouette={sil_score:.3f}")

    # Use silhouette score to pick best k
    best_k = list(K_range)[np.argmax(silhouette_scores)]
    print(f"\nBest K (by silhouette): {best_k}")

    # Final clustering with best K
    kmeans = KMeans(n_clusters=best_k, random_state=42, n_init=10)
    clusters = kmeans.fit_predict(X)

    # Add cluster assignments to pages
    for i, page in enumerate(pages):
        page['cluster'] = clusters[i]
        page['pca_x'] = X_pca[i, 0]
        page['pca_y'] = X_pca[i, 1]

    return {
        'pages': pages,
        'pca': pca,
        'X_pca': X_pca,
        'kmeans': kmeans,
        'clusters': clusters,
        'vectorizer': vectorizer,
        'X': X,
        'inertias': list(inertias),
        'silhouette_scores': list(silhouette_scores),
        'K_range': list(K_range),
        'best_k': best_k,
        'titles': titles
    }

def create_visualizations(results):
    """Create and save visualization plots."""
    pages = results['pages']
    X_pca = results['X_pca']
    clusters = results['clusters']
    best_k = results['best_k']

    # Set up the plotting style
    sns.set_style("whitegrid")
    plt.rcParams['figure.figsize'] = (16, 12)

    fig = plt.figure(figsize=(16, 12))

    # 1. PCA scatter plot with clusters
    ax1 = plt.subplot(2, 3, 1)
    scatter = ax1.scatter(X_pca[:, 0], X_pca[:, 1], c=clusters, cmap='tab20', s=100, alpha=0.6, edgecolors='black', linewidth=0.5)
    ax1.set_xlabel(f'PC1 ({results["pca"].explained_variance_ratio_[0]:.1%})', fontsize=11)
    ax1.set_ylabel(f'PC2 ({results["pca"].explained_variance_ratio_[1]:.1%})', fontsize=11)
    ax1.set_title('PCA with KMeans Clustering', fontsize=12, fontweight='bold')
    plt.colorbar(scatter, ax=ax1, label='Cluster')

    # Add page titles to plot (subset to avoid clutter)
    sample_indices = np.random.choice(len(pages), min(20, len(pages)), replace=False)
    for idx in sample_indices:
        ax1.annotate(results['titles'][idx][:15],
                    (X_pca[idx, 0], X_pca[idx, 1]),
                    fontsize=7, alpha=0.5)

    # 2. Elbow curve
    ax2 = plt.subplot(2, 3, 2)
    ax2.plot(results['K_range'], results['inertias'], 'bo-', linewidth=2, markersize=8)
    ax2.axvline(x=results['best_k'], color='r', linestyle='--', label=f'Best K={results["best_k"]}')
    ax2.set_xlabel('Number of Clusters (K)', fontsize=11)
    ax2.set_ylabel('Inertia', fontsize=11)
    ax2.set_title('Elbow Method', fontsize=12, fontweight='bold')
    ax2.legend()
    ax2.grid(True)

    # 3. Silhouette scores
    ax3 = plt.subplot(2, 3, 3)
    ax3.plot(results['K_range'], results['silhouette_scores'], 'go-', linewidth=2, markersize=8)
    ax3.axvline(x=results['best_k'], color='r', linestyle='--', label=f'Best K={results["best_k"]}')
    ax3.set_xlabel('Number of Clusters (K)', fontsize=11)
    ax3.set_ylabel('Silhouette Score', fontsize=11)
    ax3.set_title('Silhouette Scores', fontsize=12, fontweight='bold')
    ax3.legend()
    ax3.grid(True)

    # 4. Cluster size distribution
    ax4 = plt.subplot(2, 3, 4)
    cluster_counts = Counter(clusters)
    cluster_ids = sorted(cluster_counts.keys())
    counts = [cluster_counts[c] for c in cluster_ids]
    ax4.bar(cluster_ids, counts, color='steelblue', edgecolor='black')
    ax4.set_xlabel('Cluster ID', fontsize=11)
    ax4.set_ylabel('Number of Pages', fontsize=11)
    ax4.set_title('Pages per Cluster', fontsize=12, fontweight='bold')
    ax4.grid(axis='y')

    # 5. Page word count distribution by cluster
    ax5 = plt.subplot(2, 3, 5)
    cluster_word_counts = {}
    for page in pages:
        c = page['cluster']
        if c not in cluster_word_counts:
            cluster_word_counts[c] = []
        cluster_word_counts[c].append(page['word_count'])

    data_for_box = [cluster_word_counts[c] for c in sorted(cluster_word_counts.keys())]
    bp = ax5.boxplot(data_for_box, patch_artist=True)
    ax5.set_xticklabels(sorted(cluster_word_counts.keys()))
    for patch in bp['boxes']:
        patch.set_facecolor('lightblue')
    ax5.set_xlabel('Cluster ID', fontsize=11)
    ax5.set_ylabel('Word Count', fontsize=11)
    ax5.set_title('Content Size by Cluster', fontsize=12, fontweight='bold')
    ax5.grid(axis='y')

    # 6. Variance explained
    ax6 = plt.subplot(2, 3, 6)
    ax6.bar(range(1, 3), results['pca'].explained_variance_ratio_, color=['#1f77b4', '#ff7f0e'], edgecolor='black')
    ax6.set_ylabel('Explained Variance Ratio', fontsize=11)
    ax6.set_title('PCA Explained Variance', fontsize=12, fontweight='bold')
    ax6.set_xticks([1, 2])
    ax6.set_xticklabels(['PC1', 'PC2'])
    ax6.grid(axis='y')

    plt.tight_layout()
    output_path = Path('/Users/jackmaguire/Developer/jackmaguire-site/scripts/notion_analysis.png')
    plt.savefig(output_path, dpi=150, bbox_inches='tight')
    print(f"\n✓ Visualization saved to {output_path}")
    plt.close()

def create_cluster_summary(results):
    """Create a summary of each cluster."""
    pages = results['pages']
    vectorizer = results['vectorizer']

    summary_df = []

    for cluster_id in range(results['best_k']):
        cluster_pages = [p for p in pages if p['cluster'] == cluster_id]
        cluster_texts = [p['content'] for p in cluster_pages]

        # Get top terms for this cluster
        cluster_vec = vectorizer.transform(cluster_texts)
        avg_vec = cluster_vec.mean(axis=0)
        feature_names = vectorizer.get_feature_names_out()
        top_indices = np.argsort(avg_vec.A1)[-5:]
        top_terms = [feature_names[i] for i in top_indices[::-1]]

        # Get stats
        avg_word_count = np.mean([p['word_count'] for p in cluster_pages])
        avg_char_count = np.mean([p['char_count'] for p in cluster_pages])

        # Get sample pages
        sample_pages = sorted(cluster_pages, key=lambda p: p['word_count'], reverse=True)[:3]
        sample_titles = [p['title'] for p in sample_pages]

        summary_df.append({
            'Cluster': cluster_id,
            'Page Count': len(cluster_pages),
            'Avg Words': f"{avg_word_count:.0f}",
            'Avg Chars': f"{avg_char_count:.0f}",
            'Top Terms': ", ".join(top_terms),
            'Sample Pages': " | ".join(sample_titles)
        })

    df = pd.DataFrame(summary_df)

    # Save to CSV
    csv_path = Path('/Users/jackmaguire/Developer/jackmaguire-site/scripts/notion_cluster_summary.csv')
    df.to_csv(csv_path, index=False)
    print(f"✓ Cluster summary saved to {csv_path}")

    # Print to console
    print("\n" + "="*120)
    print("CLUSTER SUMMARY")
    print("="*120)
    print(df.to_string(index=False))
    print("="*120)

def create_detailed_report(results):
    """Create a detailed text report."""
    report_lines = []
    pages = results['pages']

    report_lines.append("="*100)
    report_lines.append("NOTION DATABASE ANALYSIS: PCA & CLUSTERING REPORT")
    report_lines.append("="*100)
    report_lines.append("")

    report_lines.append(f"Total Pages Analyzed: {len(pages)}")
    report_lines.append(f"Optimal Number of Clusters: {results['best_k']}")
    report_lines.append(f"PCA Variance Explained (2 components): {sum(results['pca'].explained_variance_ratio_):.2%}")
    report_lines.append(f"  - PC1: {results['pca'].explained_variance_ratio_[0]:.2%}")
    report_lines.append(f"  - PC2: {results['pca'].explained_variance_ratio_[1]:.2%}")
    report_lines.append("")

    report_lines.append("CLUSTER BREAKDOWN")
    report_lines.append("-" * 100)

    for cluster_id in range(results['best_k']):
        cluster_pages = [p for p in pages if p['cluster'] == cluster_id]
        report_lines.append(f"\nCluster {cluster_id}: {len(cluster_pages)} pages")

        # Stats
        word_counts = [p['word_count'] for p in cluster_pages]
        report_lines.append(f"  Word count: min={min(word_counts)}, max={max(word_counts)}, avg={np.mean(word_counts):.0f}")

        # Top pages by content length
        top_pages = sorted(cluster_pages, key=lambda p: p['word_count'], reverse=True)[:5]
        report_lines.append(f"  Top pages:")
        for p in top_pages:
            report_lines.append(f"    - {p['title']} ({p['word_count']} words)")

    report_lines.append("")
    report_lines.append("="*100)

    report_text = "\n".join(report_lines)

    # Save to file
    report_path = Path('/Users/jackmaguire/Developer/jackmaguire-site/scripts/notion_analysis_report.txt')
    with open(report_path, 'w') as f:
        f.write(report_text)

    print(report_text)
    print(f"\n✓ Report saved to {report_path}")

if __name__ == "__main__":
    print("="*100)
    print("NOTION CLUSTERING & PCA ANALYSIS")
    print("="*100)

    try:
        pages = load_all_pages()
        results = perform_analysis(pages)
        create_visualizations(results)
        create_cluster_summary(results)
        create_detailed_report(results)

        print("\n" + "="*100)
        print("ANALYSIS COMPLETE")
        print("="*100)
        print(f"Output files:")
        print(f"  - notion_analysis.png (visualization)")
        print(f"  - notion_cluster_summary.csv (cluster stats)")
        print(f"  - notion_analysis_report.txt (detailed report)")

    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)

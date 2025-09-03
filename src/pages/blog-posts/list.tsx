import React, { useEffect, useState } from 'react';
import { List, useTable, EditButton, ShowButton } from '@refinedev/antd';
import { Table, Space, Tag, Typography, Image, Switch, Progress, Tooltip } from 'antd';
import { BlogPost, BlogCategory, Profile } from '../../lib/supabase';
import { CustomDeleteButton } from '../../components/custom-delete-button';
import { SEOStatusDisplay } from '../../components/seo-status-display';
import { useMany } from '@refinedev/core';
import { supabase } from '../../lib/supabase';
import { CheckCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import '../../styles/blog-posts-enhanced.css';

export const BlogPostList: React.FC = () => {
  const [seoData, setSeoData] = useState<{[key: string]: any}>({});
  const [loadingSEO, setLoadingSEO] = useState(false);
  
  const { tableProps } = useTable<BlogPost>({
    resource: 'blog_posts',
    syncWithLocation: true,
  });

  // Load SEO data for all blog posts
  useEffect(() => {
    const loadSEOData = async () => {
      if (!tableProps.dataSource || tableProps.dataSource.length === 0) return;
      
      setLoadingSEO(true);
      try {
        const blogPostIds = tableProps.dataSource.map((post: any) => post.id);
        const { data } = await supabase
          .from('seo_pages')
          .select('*')
          .eq('reference_type', 'blog')
          .in('reference_id', blogPostIds);
        
        if (data) {
          const seoMap = data.reduce((acc, item) => {
            acc[item.reference_id] = item;
            return acc;
          }, {} as {[key: string]: any});
          setSeoData(seoMap);
        }
      } catch (error) {
        console.error('Error loading SEO data:', error);
      } finally {
        setLoadingSEO(false);
      }
    };

    loadSEOData();
  }, [tableProps.dataSource]);

  const { data: authorData, isLoading: authorIsLoading } = useMany<Profile>({
    resource: 'profiles',
    ids: tableProps?.dataSource?.map((item: any) => item.author_id).filter(Boolean) ?? [],
    queryOptions: {
      enabled: !!tableProps?.dataSource,
    },
  });

  const columns = [
    {
      title: 'Tiêu đề bài viết',
      dataIndex: 'title',
      key: 'title',
      width: 250,
      render: (value: string, record: any) => (
        <div className="blog-post-title-container">
          <div className="blog-post-title">{value}</div>
          <div className="blog-post-slug">/{record.slug}</div>
        </div>
      ),
    },
    {
      title: 'Tóm tắt',
      dataIndex: 'excerpt',
      key: 'excerpt',
      width: 300,
      render: (value: string) => value ? `${value.slice(0, 80)}...` : '-',
    },
    {
      title: 'Danh mục',
      dataIndex: 'category_id',
      key: 'category_id',
      width: 150,
      render: (value: string, record: any) => {
        if (record.blog_categories) {
          return (
            <div className="blog-category-display">
              <Tag color="blue" className="blog-category-name">{record.blog_categories.name}</Tag>
              <div className="blog-category-slug">
                {record.blog_categories.slug}
              </div>
            </div>
          );
        }
        return '-';
      },
    },
    {
      title: 'Tác giả',
      dataIndex: 'author_id',
      key: 'author_id',
      width: 120,
      render: (value: string) => {
        if (authorIsLoading) return 'Đang tải...';
        const author = authorData?.data?.find((item) => item.id === value);
        return author ? `${author.first_name || ''} ${author.last_name || ''}`.trim() || author.email || '-' : '-';
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      width: 100,
      render: (value: string) => {
        const statusConfig = {
          draft: { color: 'default', text: 'Bản nháp' },
          published: { color: 'success', text: 'Đã xuất bản' },
          archived: { color: 'warning', text: 'Đã lưu trữ' },
        };
        const config = statusConfig[value as keyof typeof statusConfig] || statusConfig.draft;
        return <Tag color={config.color} className="blog-status-tag">{config.text}</Tag>;
      },
    },
    {
      title: 'Tính năng',
      key: 'features',
      width: 120,
      render: (_: any, record: any) => (
        <Space direction="vertical" size="small" className="blog-feature-tags">
          {record.is_featured && <Tag color="gold">Nổi bật</Tag>}
          {record.is_pinned && <Tag color="red">Ghim</Tag>}
        </Space>
      ),
    },
    {
      title: 'SEO Status',
      key: 'seo_status',
      width: 200,
      render: (_: any, record: any) => {
        const recordSEOData = seoData[record.id];
        return (
          <SEOStatusDisplay 
            seoData={recordSEOData} 
            showDetails={false}
            size="small"
          />
        );
      },
    },
    {
      title: 'Thống kê',
      key: 'stats',
      width: 150,
      render: (_: any, record: any) => (
        <div className="blog-stats">
          <div>👁️ {record.view_count} lượt xem</div>
          {record.read_time && <div>⏱️ {record.read_time} phút</div>}
        </div>
      ),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      width: 150,
      fixed: 'right',
      render: (_: any, record: any) => (
        <Space className="blog-actions">
          <ShowButton hideText size="small" recordItemId={record.id} />
          <EditButton hideText size="small" recordItemId={record.id} />
          <CustomDeleteButton 
            recordItemId={record.id} 
            resource="blog-posts"
            size="small"
            hideText
          />
        </Space>
      ),
    },
  ];

  return (
    <List>
      <Table
        {...tableProps}
        columns={columns}
        rowKey="id"
        scroll={{ x: 1630 }}
        loading={tableProps.loading || loadingSEO}
        className="blog-list-table"
      />
    </List>
  );
};

export default BlogPostList;

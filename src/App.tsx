import { Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import {
  ErrorComponent,
  Layout,
  notificationProvider,
} from "@refinedev/antd";
import routerBindings, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";

import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { ColorModeContextProvider } from "./contexts/color-mode";
import { dataProvider as customDataProvider } from "./lib/dataProvider";

// Import CSS chung
import "./styles/media-management.css";
import "./styles/media-gallery-selector.css";

// Import our custom pages
import { CategoryList } from "./pages/categories";
import { CategoryCreate } from "./pages/categories/create";
import { CategoryEdit } from "./pages/categories/edit";
import { CategoryShow } from "./pages/categories/show";

import { ProductList } from "./pages/products/list";
import { ProductCreate } from "./pages/products/create";
import { ProductEdit } from "./pages/products/edit";
import { ProductShow } from "./pages/products/show";
import { TestProductEdit } from "./pages/products/test-edit";

import { ProfileList } from "./pages/profiles";
import { ProfileCreate } from "./pages/profiles/create";
import { ProfileEdit } from "./pages/profiles/edit";
import { ProfileShow } from "./pages/profiles/show";

import { BlogPostList } from "./pages/blog-posts";
import { BlogPostCreate } from "./pages/blog-posts/create";
import { BlogPostEdit } from "./pages/blog-posts/edit";
import { BlogPostShow } from "./pages/blog-posts/show";

import { BlogCategoryList } from "./pages/blog-categories";
import { BlogCategoryCreate } from "./pages/blog-categories/create";
import { BlogCategoryEdit } from "./pages/blog-categories/edit";
import { BlogCategoryShow } from "./pages/blog-categories/show";

import { TagList } from "./pages/tags";
import { TagCreate } from "./pages/tags/create";
import { TagEdit } from "./pages/tags/edit";
import { TagShow } from "./pages/tags/show";

import { OrderList } from "./pages/orders";
import { OrderCreate } from "./pages/orders/create";
import { OrderEdit } from "./pages/orders/edit";
import { OrderShow } from "./pages/orders/show";

import { ProductVariantList } from "./pages/product-variants";
import { ProductVariantCreate } from "./pages/product-variants/create";
import { ProductVariantEdit } from "./pages/product-variants/edit";
import { ProductVariantShow } from "./pages/product-variants/show";

import { MediaList } from "./pages/media";
import { MediaCreate } from "./pages/media/create";
import { MediaEdit } from "./pages/media/edit";
import { MediaShow } from "./pages/media/show";

import { MediaGallerySelectorDemo } from "./pages/media-gallery-demo";

import { Dashboard } from "./pages/dashboard";

import { AISettings } from "./pages/ai-settings";

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <Refine
            dataProvider={customDataProvider}
            notificationProvider={notificationProvider}
            routerProvider={routerBindings}
            resources={[
              {
                name: "categories",
                list: "/categories",
                create: "/categories/create",
                edit: "/categories/edit/:id",
                show: "/categories/show/:id",
                meta: {
                  canDelete: true,
                  label: "Danh mục",
                },
              },
              {
                name: "products",
                list: "/products",
                create: "/products/create",
                edit: "/products/edit/:id",
                show: "/products/show/:id",
                meta: {
                  canDelete: true,
                  label: "Sản phẩm",
                },
              },
              {
                name: "profiles",
                list: "/profiles",
                create: "/profiles/create",
                edit: "/profiles/edit/:id",
                show: "/profiles/show/:id",
                meta: {
                  canDelete: true,
                  label: "Người dùng",
                },
              },
              {
                name: "blog_posts",
                list: "/blog-posts",
                create: "/blog-posts/create",
                edit: "/blog-posts/edit/:id",
                show: "/blog-posts/show/:id",
                meta: {
                  canDelete: true,
                  label: "Bài viết",
                },
              },
              {
                name: "blog_categories",
                list: "/blog-categories",
                create: "/blog-categories/create",
                edit: "/blog-categories/edit/:id",
                show: "/blog-categories/show/:id",
                meta: {
                  canDelete: true,
                  label: "Danh mục blog",
                },
              },
              {
                name: "tags",
                list: "/tags",
                create: "/tags/create",
                edit: "/tags/edit/:id",
                show: "/tags/show/:id",
                meta: {
                  canDelete: true,
                  label: "Tags",
                },
              },
              {
                name: "orders",
                list: "/orders",
                create: "/orders/create",
                edit: "/orders/edit/:id",
                show: "/orders/show/:id",
                meta: {
                  canDelete: true,
                  label: "Đơn hàng",
                },
              },
              {
                name: "product_variants",
                list: "/product-variants",
                create: "/product-variants/create",
                edit: "/product-variants/edit/:id",
                show: "/product-variants/show/:id",
                meta: {
                  canDelete: true,
                  label: "Biến thể sản phẩm",
                },
              },
              {
                name: "media",
                list: "/media",
                create: "/media/create",
                edit: "/media/edit/:id",
                show: "/media/show/:id",
                meta: {
                  canDelete: true,
                  label: "Media",
                },
              },
              {
                name: "ai-settings",
                list: "/ai-settings",
                meta: {
                  label: "Cài đặt AI",
                },
              },
            ]}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              useNewQueryKeys: true,
              projectId: "YOUR_PROJECT_ID",
            }}
          >
            <Routes>
              <Route
                element={
                  <Layout>
                    <Outlet />
                  </Layout>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="/categories">
                  <Route index element={<CategoryList />} />
                  <Route path="create" element={<CategoryCreate />} />
                  <Route path="edit/:id" element={<CategoryEdit />} />
                  <Route path="show/:id" element={<CategoryShow />} />
                </Route>
                <Route path="/products">
                  <Route index element={<ProductList />} />
                  <Route path="create" element={<ProductCreate />} />
                  <Route path="edit/:id" element={<ProductEdit />} />
                  <Route path="show/:id" element={<ProductShow />} />
                  <Route path="test-edit/:id" element={<TestProductEdit />} />
                </Route>
                <Route path="/profiles">
                  <Route index element={<ProfileList />} />
                  <Route path="create" element={<ProfileCreate />} />
                  <Route path="edit/:id" element={<ProfileEdit />} />
                  <Route path="show/:id" element={<ProfileShow />} />
                </Route>
                <Route path="/blog-posts">
                  <Route index element={<BlogPostList />} />
                  <Route path="create" element={<BlogPostCreate />} />
                  <Route path="edit/:id" element={<BlogPostEdit />} />
                  <Route path="show/:id" element={<BlogPostShow />} />
                </Route>
                <Route path="/blog-categories">
                  <Route index element={<BlogCategoryList />} />
                  <Route path="create" element={<BlogCategoryCreate />} />
                  <Route path="edit/:id" element={<BlogCategoryEdit />} />
                  <Route path="show/:id" element={<BlogCategoryShow />} />
                </Route>
                <Route path="/tags">
                  <Route index element={<TagList />} />
                  <Route path="create" element={<TagCreate />} />
                  <Route path="edit/:id" element={<TagEdit />} />
                  <Route path="show/:id" element={<TagShow />} />
                </Route>
                <Route path="/orders">
                  <Route index element={<OrderList />} />
                  <Route path="create" element={<OrderCreate />} />
                  <Route path="edit/:id" element={<OrderEdit />} />
                  <Route path="show/:id" element={<OrderShow />} />
                </Route>
                <Route path="/product-variants">
                  <Route index element={<ProductVariantList />} />
                  <Route path="create" element={<ProductVariantCreate />} />
                  <Route path="edit/:id" element={<ProductVariantEdit />} />
                  <Route path="show/:id" element={<ProductVariantShow />} />
                </Route>
                <Route path="/media">
                  <Route index element={<MediaList />} />
                  <Route path="create" element={<MediaCreate />} />
                  <Route path="edit/:id" element={<MediaEdit />} />
                  <Route path="show/:id" element={<MediaShow />} />
                  <Route path="gallery-selector-demo" element={<MediaGallerySelectorDemo />} />
                </Route>
                <Route path="/ai-settings" element={<AISettings />} />
              </Route>
            </Routes>

            <RefineKbar />
            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;

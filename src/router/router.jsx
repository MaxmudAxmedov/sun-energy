import { createBrowserRouter } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Layout from "../layout/Layout";

// Sahifalarni `lazy` bilan yuklash
const Clients = lazy(() => import("../page/Clients/Clients"));
const Products = lazy(() => import("../page/Products/Products"));
const Employee = lazy(() => import("../page/Employee/employee"));
const Base = lazy(() => import("../page/Base/Base"));
const Report = lazy(() => import("../page/Report/Report"));
const Contract = lazy(() => import("../page/Contract/Contract"));
const Setting = lazy(() => import("../page/Setting/Setting"));
const NotFound = lazy(() => import("../page/NotFound/NotFound"));
const LoginPaage = lazy(() => import("../auth/login"));

const CreateProduct = lazy(() =>
  import("../page/Products/CreateProduct/create-product")
);
const CreateClient = lazy(() =>
  import("../page/Clients/CreateClients/create-clients")
);

// Loading skeleton
const Loader = () => (
  <div className="h-screen flex items-center justify-center">
    <div className="animate-spin h-8 w-8 border-4 border-t-blue-500 rounded-full"></div>
  </div>
);

// Router konfiguratsiyasi
export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <Suspense fallback={<Loader />}>
        <LoginPaage />
      </Suspense>
    ),
  },
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: (
          <Suspense fallback={<Loader />}>
            <Products />
          </Suspense>
        ),
      },
      {
        path: "/createProduct",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateProduct />
          </Suspense>
        ),
      },
      {
        path: "/clients",
        element: (
          <Suspense fallback={<Loader />}>
            <Clients />
          </Suspense>
        ),
      },
      {
        path: "/createClient",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateClient />
          </Suspense>
        ),
      },
      {
        path: "/employee",
        element: (
          <Suspense fallback={<Loader />}>
            <Employee />
          </Suspense>
        ),
      },
      {
        path: "/base",
        element: (
          <Suspense fallback={<Loader />}>
            <Base />
          </Suspense>
        ),
      },
      {
        path: "/report",
        element: (
          <Suspense fallback={<Loader />}>
            <Report />
          </Suspense>
        ),
      },
      {
        path: "/contract",
        element: (
          <Suspense fallback={<Loader />}>
            <Contract />
          </Suspense>
        ),
      },
      {
        path: "/setting",
        element: (
          <Suspense fallback={<Loader />}>
            <Setting />
          </Suspense>
        ),
      },
      {
        path: "*",
        element: (
          <Suspense fallback={<Loader />}>
            <NotFound />
          </Suspense>
        ),
      },
    ],
  },
]);

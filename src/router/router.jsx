import { createBrowserRouter } from "react-router-dom";
import React, { lazy, Suspense } from "react";
import Layout from "../layout/Layout";

// Sahifalarni `lazy` bilan yuklash
const Clients = lazy(() => import("../page/Clients/Clients"));
const Products = lazy(() => import("../page/Products/Products"));
const ProductCategory = lazy(() =>
  import("../page/ProductCategory/product-category")
);
const Employee = lazy(() => import("../page/Employee/employee"));
// const Base = lazy(() => import("../page/Base/Base"));
const Report = lazy(() => import("../page/Report/Report"));
const Contract = lazy(() => import("../page/Contract/Contract"));
const Users = lazy(() => import("../page/Users/users"));
// const Position = lazy(() => import("../page/Position/Position"));
const Setting = lazy(() => import("../page/Setting/Setting"));
const NotFound = lazy(() => import("../page/NotFound/NotFound"));
const LoginPaage = lazy(() => import("../auth/login"));

const CreateProduct = lazy(() =>
  import("../page/Products/CreateProduct/create-product")
);
const CreateClient = lazy(() =>
  import("../page/Clients/CreateClients/create-clients")
);
// const CreatePosition = lazy(() =>
//     import("../page/Position/Create-Position/create-position")
// );
const CreateEmployee = lazy(() =>
  import("../page/Employee/CreateEmployee/create-employee")
);
const CreateProductCategory = lazy(() =>
  import(
    "../page/ProductCategory/Create-Product-Category/create-product-category"
  )
);
const CreateContract = lazy(() =>
  import("../page/Contract/CreateContract/CreatrContract")
);

const EditEmploye = lazy(() =>
  import("../page/Employee/EditEmployee/edit-employee")
);
const EditProductCategory = lazy(() =>
  import("../page/ProductCategory/Edit-Product-Category/edit-product-category")
);
const CreateUsers = lazy(() =>
  import("../page/Users/CreateUsers/create-users")
);
// const EditPosition = lazy(() =>
//     import("../page/Position/Edit-Position/edit-position")
// );
// const EditClient = lazy(() =>
//     import("../page/Clients/Edit-Client/edit-client")
// );
// const EditProduct = lazy(() =>
//     import("../page/Products/Edit-Product/edit-product")
// );

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
        path: "/editProduct/:id",
        element: (
          <Suspense fallback={<Loader />}>
            {/* <EditProduct /> */}
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
        path: "/editClient/:id",
        element: (
          <Suspense fallback={<Loader />}>
            {/* <EditClient /> */}
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
        path: "/createEmployee",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateEmployee />
          </Suspense>
        ),
      },
      {
        path: "/editEmployee/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <EditEmploye />
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
        path: "/createContract",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateContract />
          </Suspense>
        ),
      },
      {
        path: "/createContract/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateContract />
          </Suspense>
        ),
      },
      // {
      //     path: "/position",
      //     element: (
      //         <Suspense fallback={<Loader />}>
      //             <Position />
      //         </Suspense>
      //     ),
      // },
      // {
      //     path: "/createPosition",
      //     element: (
      //         <Suspense fallback={<Loader />}>
      //             <CreatePosition />
      //         </Suspense>
      //     ),
      // },
      // {
      //     path: "/editPosition/:id",
      //     element: (
      //         <Suspense fallback={<Loader />}>
      //             <EditPosition />
      //         </Suspense>
      //     ),
      // },
      {
        path: "/productCategory",
        element: (
          <Suspense fallback={<Loader />}>
            <ProductCategory />
          </Suspense>
        ),
      },
      {
        path: "/createProductCategory",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateProductCategory />
          </Suspense>
        ),
      },
      {
        path: "/editProductCategory/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <EditProductCategory />
          </Suspense>
        ),
      },
      // {
      //   path: "/users",
      //   element: (
      //     <Suspense fallback={<Loader />}>
      //       <Users />
      //     </Suspense>
      //   ),
      // },
      {
        path: "/createUsers/:id",
        element: (
          <Suspense fallback={<Loader />}>
            <CreateUsers />
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

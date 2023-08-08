import { createBrowserRouter, Link, RouterProvider } from "react-router-dom"
import { ReactQueryDevtools } from 'react-query/devtools';
import LoginPage from './routes/login';
import ThemeProvider from "./theme";
import AdminLayout from "./layout";
import Beranda from "./routes/beranda";
import Relawan from "./routes/relawan";
import Pendukung from "./routes/pendukung";
import Dpt from "./routes/dpt";
import Pengguna from "./routes/pengguna";
import { QueryClient, QueryClientProvider } from "react-query";
import { ModalsProvider } from "@mantine/modals";
import PostPengguna from "./routes/pengguna/post";
import TableUser from "./routes/pengguna/TablePengguna";
import DetailPengguna from "./routes/pengguna/detail";
import UpdatePengguna from "./routes/pengguna/update";
import { Notifications } from '@mantine/notifications'
import ContentRelawan from "./routes/relawan/ContentRelawan";
import PostRelawan from "./routes/relawan/post";
import DetailRelawan from "./routes/relawan/DetailRelawan";
import TabelPendukung from "./routes/pendukung/TablePendukung";
import PostPendukung from "./routes/pendukung/Post";

export const queryClient = new QueryClient()

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <LoginPage />
    },
    {
      path: "/admin",
      element: <AdminLayout />,
      handle: {
        crumb: () => (
          <Link key={Math.random()} to="/admin">
            Admin
          </Link>
        ),
      },
      children: [
        {
          index: true,
          path: "beranda",
          element: <Beranda />,
          handle: {
            crumb: () => (
              <Link key={Math.random()} to="/admin/beranda">
                Beranda
              </Link>
            ),
          },
        },
        {
          path: "pengguna",
          element: <Pengguna />,
          handle: {
            crumb: () => (
              <Link key={Math.random()} to="/admin/pengguna">
                Pengguna
              </Link>
            ),
          },
          children: [
            {
              element: <TableUser />,
              index: true
            },
            {
              path: ":id/update",
              element: <UpdatePengguna />,
              handle: {
                crumb: () => (
                  <Link key={Math.random()} to="#">
                    Perbarui
                  </Link>
                )
              }
            },
            {
              path: ":id/detail",
              element: <DetailPengguna />,
              handle: {
                crumb: () => (
                  <Link key={Math.random()} to="#">
                    Detail
                  </Link>
                ),
              }
            },
            {
              path: "post",
              element: <PostPengguna />,
              handle: {
                crumb: () => (
                  <Link key={Math.random()} to="#">
                    Tambah
                  </Link>
                )
              }
            },
          ]
        },
        {
          path: "relawan",
          element: <Relawan />,
          handle: {
            crumb: () => (
              <Link key={Math.random()} to="/admin/relawan">
                Relawan
              </Link>
            ),
          },
          children: [
            {
              index: true,
              element: <ContentRelawan />
            },
            {
              path: 'post',
              element: <PostRelawan />,
              handle: {
                crumb: () => (
                  <Link key={Math.random()} to="#">
                    Tambah
                  </Link>
                ),
              },
            },
            {
              path: ':id/detail',
              element: <DetailRelawan />,
              handle: {
                crumb: () => (
                  <Link key={Math.random()} to="#">
                    Detail
                  </Link>
                )
              }
            },
          ]
        },
        {
          path: "pendukung",
          element: <Pendukung />,
          handle: {
            crumb: () => (
              <Link key={Math.random()} to="/admin/pendukung">
                Pendukung
              </Link>
            ),
          },
          children: [
            {
              element: <TabelPendukung />,
              index: true,
            },
            {
              path: 'post',
              element: <PostPendukung />,
              handle: {
                crumb: () => (
                  <Link key={Math.random()} to="#">
                    Tambah
                  </Link>
                ),
              },
            },
          ]
        },
        {
          path: "dpt",
          element: <Dpt />,
          handle: {
            crumb: () => (
              <Link key={Math.random()} to="/admin/dpt">
                DPT
              </Link>
            ),
          },
        },
      ]
    },
  ],
  {
    future: {
      // Normalize `useNavigation()`/`useFetcher()` `formMethod` to uppercase
      v7_normalizeFormMethod: true,
    },
  }
)

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ModalsProvider>
          <Notifications position="top-right" />
          <RouterProvider router={router} />
          <ReactQueryDevtools initialIsOpen />
        </ModalsProvider>
      </ThemeProvider >
    </QueryClientProvider>
  )
}

export default App

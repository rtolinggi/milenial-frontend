import { createBrowserRouter, Link, RouterProvider } from "react-router-dom"
import LoginPage from './routes/login';
import ThemeProvider from "./theme";
import AdminLayout from "./layout";
import Beranda from "./routes/beranda";
import Anggota from "./routes/anggota";
import Pendukung from "./routes/pendukung";
import Dpt from "./routes/dpt";
import Pengguna from "./routes/pengguna";
import { QueryClient, QueryClientProvider } from "react-query";
import { ModalsProvider } from "@mantine/modals";

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
          path: "anggota",
          element: <Anggota />,
          handle: {
            crumb: () => (
              <Link key={Math.random()} to="/admin/anggota">
                Anggota
              </Link>
            ),
          },
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
        }
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
          <RouterProvider router={router} />
        </ModalsProvider>
      </ThemeProvider >
    </QueryClientProvider>
  )
}

export default App

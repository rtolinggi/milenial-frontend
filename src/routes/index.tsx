import { Container, LoadingOverlay } from "@mantine/core";
import { Suspense } from "react";
import {
  type LoaderFunction,
  defer,
  useLoaderData,
  Await,
  Navigate,
} from "react-router-dom";
import { GetSession } from '../api/auth.api'

export default function Root(): JSX.Element {
  const loaderData: any = useLoaderData();
  return (
    <Container>
      <Suspense fallback={<LoadingOverlay visible={loaderData} />}>
        <Await
          resolve={loaderData.session}
          errorElement={<Navigate to="/login" />}>
          {(data) => data && <Navigate to={"/admin/beranda"} />}
        </Await>
      </Suspense>
    </Container>
  );
}

export const loader: LoaderFunction = () => {
  return defer({ session: GetSession() });
};

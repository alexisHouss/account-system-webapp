import '../styles/globals.scss';
import AuthLayout from "@/shared/layout/auth_layout";
import MainLayout from '@/shared/layout/main_layout';

// A dictionary of available layouts
const layouts: any = {

  AuthLayout: AuthLayout,
  MainLayout: MainLayout,

};
function MyApp({ Component, pageProps }: any) {
  // Check if the page component defines a layout
  // If not, use a simple fragment wrapper
  const Layout = layouts[Component.layout] || ((pageProps: any) => <Component>{pageProps}</Component>);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;

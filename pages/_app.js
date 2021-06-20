import Footer from '../src/components/footer';
import Header from '../src/components/header';
import '../styles/globals.css';

import { useRouter } from 'next/router';
import { Provider } from 'react-redux';
import { useStore } from '../src/redux/store';

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const store = useStore(pageProps.initialReduxState);

  return (
    <>
      {router.pathname !== '/' && <Header path={router.pathname} />}
      <Provider store={store}>
        <Component {...pageProps} />
      </Provider>
      <Footer />
    </>
  );
}

export default MyApp;

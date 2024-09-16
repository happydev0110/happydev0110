import Navbar from "./navbar";
import Footer from "./footer";
import Wallet_modal from "./modal/wallet_modal";
// import BidsModal from "./modal/bidsModal";
// import BuyModal from "./modal/buyModal";
import DropModal from "./modal/dropModal"

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      <Wallet_modal />
      <DropModal />
      {/* <BidsModal />
      <BuyModal /> */}
      <main>{children}</main>
      <Footer />
    </>
  );
}

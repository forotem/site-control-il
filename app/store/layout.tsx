import { StoreChat } from "./StoreChat";
import { CartDrawer } from "./CartUI";

// עוטף את כל דפי החנות (/store, /store/finder, /store/<slug>) בעוזר המכירות ובעגלה.
export default function StoreLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <CartDrawer />
      <StoreChat />
    </>
  );
}

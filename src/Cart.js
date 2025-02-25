import { Link } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import Button from "./Button.js";

// TODO: Replace with your own publishable key
const stripeLoadedPromise = loadStripe("pk_test_51LQtUyLacYG8sMVCpQIHpTdGa5JsE8ogoGplCN5gsepXCzSBRvF2wej4c8bKFXc6SxO39lUr9dcjIekZz1uzHsmS00Fi4NhbR3");

export default function Cart(props) {
  const { cart, onProductPlus, onProductMinus, onProductDelete } = props;


  const totalPrice = cart.reduce(
    (total, product) => total + product.price * product.quantity,
    0
  );

  function handleFormSubmit(event) {
    event.preventDefault();

    const lineItems = cart.map((product, i) => {
      return { price: product.price_id, quantity: product.quantity };
    });

    console.log(lineItems)

    const shippingCountries = {
      allowedCountries: ["US", "DE", "AT", "CH", "FR", "BE", "NL", "LU", "DK", "SE", "IT", "PL"]
    };

    stripeLoadedPromise.then((stripe) => {
      stripe
        .redirectToCheckout({
          lineItems: lineItems,
          mode: "payment",
          successUrl: "https://phiele.github.io/cavelius-art/#/products",
          cancelUrl: "https://phiele.github.io/cavelius-art/#/products",
          shippingAddressCollection: shippingCountries
        })
        .then((response) => {
          // this will only log if the redirect did not work
          console.log(response.error);
        })
        .catch((error) => {
          // wrong API key? you will see the error message here
          console.log(error);
        });
    });
  }

  return (
    <div className="cart-layout">
      <div className="cart">
        <h1>Your Cart</h1>
        {cart.length === 0 && (
          <p>You have not added any product to your cart yet.</p>
        )}
        {cart.length > 0 && (
          <>
            <div className="cart-products">
              {cart.map((product) => {
                return (
                  <div className="cart-product">
                    <div className="cart-product-name">
                      <Link to={`/products/${product.id}`}>
                        <img
                          src={product.image_urls[0]}
                          width="60"
                          height="60"
                          alt=""
                        />
                      </Link>
                      <Link to={`/products/${product.id}`}>
                        {product.name}
                      </Link>
                    </div>
                    <div className="cart-product-quantity">
                      Quantity:
                      <Button
                        className="btn-minus"
                        circle
                        onClick={() => onProductMinus(product)}
                      >
                        -
                      </Button>
                      <p>
                        {product.quantity}
                      </p>
                      <Button
                        className="btn-plus"
                        circle
                        onClick={() => onProductPlus(product)}
                      >
                        +
                      </Button>
                    </div>
                    <div className="cart-product-total">
                      €{product.price * product.quantity}
                      <Button
                        circle
                        className="btn-delete"
                        onClick={() => onProductDelete(product.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="cart-total">
              {/* <div className="cart-coupon">t</div> */}
              <div className="cart-total-positions">
                TOTAL (incl. VAT): €{totalPrice}
              </div>
            </div>
            <form className="pay-form" onSubmit={handleFormSubmit}>
              <div className="pay-form-btn">
                <div className="pay-form-btn-placement">
                  <Button type="submit">Checkout</Button>
                </div>
                <p>
                  By clicking "Checkout" I approve the Terms and conditions and I agree to the Privacy policy.
                </p>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

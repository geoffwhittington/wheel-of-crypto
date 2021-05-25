import { useState, useEffect } from "react";

import { localSetupWallet, requestAirdrop, submitPayment } from "./lib";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import WheelComponent from "react-wheel-of-prizes";
import "react-wheel-of-prizes/dist/index.css";
import KinLogo from "./kin-logo.png";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";

function App() {
  const [paymentReceived, setPaymentReceived] = useState(false);
  const [paymentSuccess, setPaymentSucess] = useState(false);
  const [walletAccounts, setWalletAccounts] = useState(null);

  useEffect(() => {
    const setupWallet = async () => {
      let wa = await localSetupWallet();
      setWalletAccounts(wa);
    };
    return setupWallet();
  }, []);

  const segments = [
    "better luck next time",
    "won 70",
    "won 10",
    "better luck next time",
    "won 2",
    "won uber pass",
    "better luck next time",
    "won a voucher",
  ];
  const segColors = [
    "#EE4040",
    "#F0CF50",
    "#815CD1",
    "#3DA5E0",
    "#34A24F",
    "#F9AA1F",
    "#EC3F3F",
    "#FF9000",
  ];
  const onFinished = (winner) => {
    console.log(winner);
    const payForSpin = async () => {
      let walletAccounts = await localSetupWallet();
      await submitPayment(
        walletAccounts.wallet,
        "Don8L4DTVrUrRAcVTsFoCRqei5Mokde3CV3K9Ut4nAGZ",
        "1",
        "WHEELOFCRYPTO",
        onPaymentSend,
        onPaymentEnd,
        false
      );
    };
    payForSpin();
  };

  const onPaymentSend = async () => {
    setPaymentReceived(false);
  };
  const onPaymentEnd = async (paymentResult) => {
    setPaymentReceived(true);
    setPaymentSucess(paymentResult.success);

    if (paymentResult.success) {
      await onAccountUpdate({
        wallet: paymentResult.wallet,
        tokenAccounts: paymentResult.tokenAccounts,
      });
    }
  };
  const onAccountUpdate = async (wallet_and_accounts) => {
    setWalletAccounts(wallet_and_accounts);
  };
  /*

  */
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          direction="row"
          justify="space-between"
          alignItems="flex-start"
        >
          <Grid
            item
            xs={12}
            style={{
              textAlign: "center",
            }}
          >
            <Typography variant="h2" component="h2">
              Do Your Own Research (DYOR)
            </Typography>
            <p></p>
            <Typography variant="h4" component="h2">
              Spin the Wheel for today's crypto wisdom. Each spin is only 1 Kin.
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <img src={KinLogo} height="40em" alt="KIN" />
            <Typography variant="body" color="textSecondary" component="p">
              <a href="https://kin.org/">KIN</a> is one of the fastest and most
              used cryptocurrencies.
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <WheelComponent
              segments={segments}
              segColors={segColors}
              onFinished={(winner) => onFinished(winner)}
              primaryColor="black"
              contrastColor="white"
              buttonText="1 Kin"
              isOnlyOnce={false}
              size={200}
              upDuration={100}
              downDuration={10}
              style={{ paddingBottom: "0px" }}
            />
          </Grid>
          <Grid item xs={3}>
            {walletAccounts && (
              <>
                <p>
                  <strong>Wallet address:</strong>{" "}
                  {walletAccounts.wallet.publicKey}
                </p>
                <p>
                  <strong>Wallet balance:</strong>{" "}
                  {walletAccounts.tokenAccounts[0].balance}
                </p>
              </>
            )}
          </Grid>
        </Grid>
      </Container>

      <hr />
      <strong>Payment</strong>
      {paymentReceived && <>Received payment!</>}
      {paymentReceived && paymentSuccess && <>Payment success!</>}

      <p>
        <Button
          variant="contained"
          onClick={async () => {
            await requestAirdrop(walletAccounts.wallet, "2", onAccountUpdate);
          }}
        >
          Airdrop
        </Button>
      </p>
    </div>
  );
}

export default App;

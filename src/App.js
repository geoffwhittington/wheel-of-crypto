import { useState, useEffect } from "react";

import { localSetupWallet, requestAirdrop, submitPayment } from "./lib";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Grid from "@material-ui/core/Grid";
import WheelComponent from "react-wheel-of-prizes";
import "react-wheel-of-prizes/dist/index.css";
import KinLogo from "./kin-logo.png";

function App() {
  const [walletAccounts, setWalletAccounts] = useState(null);
  const [message, setMessage] = useState("");

  const { REACT_APP_NETWORK } = process.env;

  let PRODUCTION = REACT_APP_NETWORK === "prod";

  useEffect(() => {
    const setupWallet = async () => {
      let wa = await localSetupWallet(PRODUCTION);
      setWalletAccounts(wa);
    };
    return setupWallet();
  }, []);

  const segments = [
    "Just Hodl it.",
    "no keys, no crypto",
    "kin @ 1 penny",
    "vitalik impress",
    "don't bet against SBF",
    "crypto has no top because the $ has no bottom",
    "The only plan is there is no plan",
    "It ain't much, but its honest work",
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
    setMessage(winner);
    const payForSpin = async () => {
      let walletAccounts = await localSetupWallet();
      await submitPayment(
        walletAccounts.wallet,
        "Don8L4DTVrUrRAcVTsFoCRqei5Mokde3CV3K9Ut4nAGZ",
        "10",
        "WHEELOFCRYPTO",
        onPaymentSend,
        onPaymentEnd,
        false
      );
    };
    payForSpin();
  };

  const onPaymentSend = async () => {};
  const onPaymentEnd = async (paymentResult) => {
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
          spacing={4}
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
              Spin the wheel for some crypto wisdom. Each spin is only 10 Kin.
            </Typography>
          </Grid>
          <Grid item xs={3}>
            <img src={KinLogo} height="40em" alt="KIN" />
            <Typography variant="body" color="textSecondary" component="p">
              <a href="https://kin.org/">Unify your apps</a>
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <p>
              {message && (
                <Typography variant="h5" component="h5">
                  "{message}"
                </Typography>
              )}
            </p>
            {walletAccounts && walletAccounts.tokenAccounts[0].balance < 10 && (
              <>
                Deposit 10 Kin to{" "}
                <strong>{walletAccounts.wallet.publicKey}</strong> in order to
                spin. No refunds. Earn more Kin at{" "}
                <a href="https://Perk.exchange" target="_other">Perk.Exchange</a>
              </>
            )}
            {walletAccounts &&
              walletAccounts.tokenAccounts[0].balance >= 10 && (
                <WheelComponent
                  segments={segments}
                  segColors={segColors}
                  onFinished={(winner) => onFinished(winner)}
                  primaryColor="black"
                  contrastColor="white"
                  buttonText="10 Kin"
                  isOnlyOnce={false}
                  size={200}
                  upDuration={100}
                  downDuration={10}
                  style={{ paddingBottom: "0px" }}
                />
              )}
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
      {!PRODUCTION && (
        <p>
          <Button
            variant="contained"
            onClick={async () => {
              await requestAirdrop(
                walletAccounts.wallet,
                "10",
                onAccountUpdate
              );
            }}
          >
            Airdrop
          </Button>
        </p>
      )}
    </div>
  );
}

export default App;

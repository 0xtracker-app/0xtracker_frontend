import WAValidator from "trezor-address-validator";
import { ethers } from "ethers";
import { PublicKey } from "@solana/web3.js";

/**
 * This helper function detects the wallet type of a wallet address.
 * Supported types: EVM, Cosmos, solana
 *
 * @param {string} wallet // wallet address
 * @returns {string} walletType
 */
export const detectWalletType = (wallet) => {
  let isTypeEVM = ethers.utils.isAddress(wallet);
  let isTypeCosmos = WAValidator.validate(wallet, "cosmos");
  let isTypeSolana;
  try {
    const key = new PublicKey(wallet);
    isTypeSolana = Boolean(key);
  } catch (e) {
    isTypeSolana = false;
  }

  return isTypeEVM
    ? "EVM"
    : isTypeCosmos
    ? "Cosmos"
    : isTypeSolana
    ? "Solana"
    : null;
};

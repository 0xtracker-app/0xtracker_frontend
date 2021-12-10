import WAValidator from "trezor-address-validator";
import { ethers } from "ethers";
import { PublicKey } from "@solana/web3.js";
import { AccAddress } from "@terra-money/terra.js";
import { interpolateRainbow } from "d3";

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
  let isTypeTerra = AccAddress.validate(wallet);
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
    : isTypeTerra
    ? "Terra"
    : isTypeSolana
    ? "Solana"
    : null;
};

/**
 * Useful in grouping array of objects by property or key
 * @param {*} key // category to base the group on
 * @returns {Object} grouped objects
 */
export const groupBy = (array, key) =>
  array.reduce((objectsByKeyValue, obj) => {
    const value = obj[key];
    objectsByKeyValue[value] = (objectsByKeyValue[value] || []).concat(obj);
    return objectsByKeyValue;
  }, {});

/**
 * Used to calculate a point from 0 - 1
 *
 * @param {*} i
 * @param {*} intervalSize
 * @param {*} colorRangeInfo
 * @returns Number
 */
export const calculatePoint = (i, intervalSize, colorRangeInfo) => {
  var { colorStart, colorEnd, useEndAsStart } = colorRangeInfo;
  return useEndAsStart
    ? colorEnd - i * intervalSize
    : colorStart + i * intervalSize;
};

/**
 * Must use an interpolated color scale, which has a range of [0, 1]
 *
 * @param {*} dataLength
 * @param {*} colorScale
 * @param {*} colorRangeInfo
 * @returns Array
 */
export const generateColors = (
  dataLength,
  colorScale = interpolateRainbow,
  colorRangeInfo = {
    colorStart: 0,
    colorEnd: 1,
    useEndAsStart: false,
  }
) => {
  let { colorStart, colorEnd } = colorRangeInfo;
  let colorRange = colorEnd - colorStart;
  let intervalSize = colorRange / dataLength;
  let i, colorPoint;
  let colorArray = [];

  for (i = 0; i < dataLength; i++) {
    colorPoint = calculatePoint(i, intervalSize, colorRangeInfo);
    colorArray.push(colorScale(colorPoint));
  }

  return colorArray;
};

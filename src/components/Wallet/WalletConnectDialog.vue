<template>
  <v-row justify="center">
    <v-dialog v-model="walletDialog" persistent max-width="600">
      <v-card :dark="darkmode" class="pt-2 pb-5">
        <v-card-title class="d-flex flex-column mb-10">
          <v-btn
            @click="setWalletDialog(false)"
            icon
            class="text-caption text-none font-weight-bold ml-auto"
            :class="[darkmode ? 'white--text' : 'grey--text']"
            elevation="0"
            small
            :dark="darkmode"
            outlined
            circle
          >
            <v-icon size="16"> mdi-close-thick </v-icon>
          </v-btn>
          <p
            class="text-h3 font-weight-bold text-uppercase grey--text text-center mb-0"
            :class="darkmode ? 'text--lighten-1' : 'text--darken-2'"
          >
            {{ connectedWallet ? "Wallet Connected" : "Connect your Wallet" }}
          </p>
        </v-card-title>

        <v-card-text>
          <v-row
            v-if="connectedWallet"
            justify="space-around"
            style="overflow: hidden"
          >
            <div
              class="text-center mx-10"
              style="
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
              "
            >
              <v-icon color="green lighten-1" size="70" class="mb-10">
                fas fa-plug
              </v-icon>
              <p
                :class="{ 'text-white': darkmode }"
                class="mb-0"
                style="
                  width: 100%;
                  overflow: hidden;
                  text-overflow: ellipsis;
                  white-space: nowrap;
                "
              >
                Connected to
                <span class="font-weight-bold indigo--text text--accent-2">
                  {{ connectedWallet }}
                </span>
              </p>
              <p :class="{ 'text-white': darkmode }" style="max-width: 500px">
                on
                <span class="font-weight-bold indigo--text text--accent-2">
                  {{ $t(connectedWalletNetwork) }}
                </span>
                network.
              </p>
            </div>
          </v-row>
          <v-row v-else justify="space-around">
            <div
              @click="connectWallet()"
              class="m-5 d-flex flex-column align-center"
              style="cursor: pointer"
            >
              <img
                style="
                  filter: drop-shadow(0 0 0.85rem #e4725e);
                  height: 70px;
                  width: 70px;
                "
                src="@/assets/images/icons/metamask-fox.svg"
              />
              <span
                :class="{ 'text-white': darkmode }"
                class="font-weight-600 mt-2"
              >
                MetaMask
              </span>
            </div>
            <div
              @click="connectWallet()"
              class="m-5 d-flex flex-column align-center"
              style="cursor: pointer"
            >
              <div
                style="height: 70px; width: 70px"
                class="d-flex align-center justify-center"
              >
                <img
                  style="
                    filter: drop-shadow(0 0 0.75rem #5e72e4);
                    height: 60px;
                    width: 60px;
                  "
                  src="@/assets/images/icons/twt.svg"
                />
              </div>
              <span
                :class="{ 'text-white': darkmode }"
                class="font-weight-600 mt-2"
              >
                Trustwallet
              </span>
            </div>
            <div
              @click="connectKeplr()"
              class="m-5 d-flex flex-column align-center"
              style="cursor: pointer"
            >
              <div
                style="height: 70px; width: 70px"
                class="d-flex align-center justify-center"
              >
                <img
                  style="
                    filter: drop-shadow(0 0 0.75rem #5e72e4);
                    height: 60px;
                    width: 60px;
                  "
                  src="@/assets/images/icons/keplr-wallet-logo.png"
                />
              </div>
              <span
                :class="{ 'text-white': darkmode }"
                class="font-weight-600 mt-2"
              >
                Keplr
              </span>
            </div>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
        </v-card-actions>
        <v-overlay
          :absolute="absolute"
          opacity="0.98"
          :value="overlay"
          class="text-center"
        >
          <p class="mx-5 mx-md-10 text-subtitle-2 mb-0" style="line-height: 1">
            Please note that wallet functionality is still in BETA and you use
            it at your own risk. Contract functions have not been verified and
            might end up in a failed transaction. If you experience this please
            come to our Telegram channel (<a
              class="text-white"
              href="https://t.me/bsc0xtracker"
              target="_blank"
              >t.me/bsc0xtracker</a
            >) to report.
          </p>
          <v-checkbox v-model="termsAccepted" class="mx-10 mx-md-12">
            <template #label>
              <span class="text-caption" style="line-height: 1">
                I understand the risks associated with the wallet functionality
                and would like to continue.
              </span>
            </template>
          </v-checkbox>
          <v-spacer></v-spacer>
          <div class="d-flex justify-md-end justify-space-between">
            <v-btn
              class="mx-5 text-decoration-none text-overline font-weight-bold"
              @click="setWalletDialog(false)"
              depressed
              color="indigo lighten-1"
              outlined
            >
              Cancel
            </v-btn>
            <v-btn
              :disabled="!termsAccepted"
              class="mx-5 text-decoration-none text-overline font-weight-bold"
              @click="overlay = false"
              depressed
              color="indigo lighten-1"
            >
              Proceed
            </v-btn>
          </div>
        </v-overlay>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from "vuex";

export default {
  data: () => ({
    absolute: true,
    overlay: true,
    termsAccepted: false,
  }),
  computed: {
    ...mapGetters("generalStore", ["darkmode", "walletDialog"]),
    ...mapGetters("walletStore", ["connectedWallet", "connectedWalletNetwork"]),
  },
  methods: {
    ...mapActions("generalStore", ["setWalletDialog"]),
    ...mapActions("walletStore", ["connectWallet", "connectKeplr"]),
  },
};
</script>

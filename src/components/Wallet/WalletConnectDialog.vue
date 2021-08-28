<template>
  <v-row justify="center">
    <v-dialog
      v-model="walletDialog"
      persistent
      max-width="600"
    >
      <v-card :dark="darkmode" class="pt-5">
        <p class="text-h1 text-center mb-10">
          {{ connectedWallet ? 'Wallet Connected' : 'Connect your Wallet' }}
        </p>
        <v-card-text>
          <v-row v-if="connectedWallet" justify="space-around">
            <div class="text-center m-5">
              <v-btn
                class="mx-2 mb-1"
                fab
                large
              >
                <v-icon color="green">
                  fas fa-plug
                </v-icon>
              </v-btn>
              <p :class="{'text-white': darkmode}">{{ 'Connected to "' + connectedWallet + '" on "' + $t(connectedWalletNetwork) + '" network.' }}</p>
            </div>
          </v-row>
          <v-row v-else justify="space-around">
            <div class="text-center m-5">
              <v-btn
                class="mx-2 mb-1"
                fab
                large
                @click="connectWallet()"
              >
                <v-img
                  max-height="40"
                  max-width="40"
                  src="@/assets/images/icons/metamask-fox.svg"
                ></v-img>
              </v-btn>
              <p :class="{'text-white': darkmode}">
                MetaMask
              </p>
            </div>
            <div class="text-center m-5">
              <v-btn
                class="mx-2 mb-1"
                fab
                large
                @click="connectWallet()"
              >
                <v-img
                  max-height="40"
                  max-width="40"
                  src="@/assets/images/icons/twt.svg"
                ></v-img>
              </v-btn>
              <p :class="{'text-white': darkmode}">
                Trustwallet
              </p>
            </div>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            text
            @click="setWalletDialog(false)"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  computed: {
    ...mapGetters('generalStore', ['darkmode', 'walletDialog']),
    ...mapGetters('walletStore', ['connectedWallet', 'connectedWalletNetwork']),
  },
  methods: {
    ...mapActions('generalStore', ['setWalletDialog']),
    ...mapActions('walletStore', ['connectWallet']),
  },
}
</script>
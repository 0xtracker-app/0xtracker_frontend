<template>
  <v-container v-if="connectedWallet">
    <v-card
      class="mb-4 card-padding"
      :dark="darkmode"
      :style="{
        filter: darkmode
          ? 'drop-shadow(1px -1px 0px #5C6BC0) drop-shadow(-1px 1px 1px #0C0B10)'
          : '',
      }"
    >
      <v-row no-gutters class="d-flex align-center py-5">
        <v-btn
          class="text-none text-caption font-weight-bold white--text"
          elevation="0"
          color="indigo lighten-1"
          @click="openDialog"
          >Add New Beacon</v-btn
        >
      </v-row>

      <v-dialog v-model="dialog" max-width="600px">
        <v-card :dark="darkmode">
          <v-card-title>
            <span class="headline">Add New Beacon</span>
          </v-card-title>
          <v-card-text>
            <v-form
              ref="form"
              v-model="valid"
              :class="[darkmode ? 'white--text' : 'grey--text text--darken-2']"
            >
              <v-select
                v-model="beaconType"
                :items="beaconTypes"
                label="Beacon Type"
                @change="updateFields"
                :menu-props="darkmode ? 'dark' : 'light'"
                required
              ></v-select>

              <v-select
                v-if="showNetworkAndAddress"
                v-model="network"
                :items="networks"
                label="Network"
                :menu-props="darkmode ? 'dark' : 'light'"
                required
              ></v-select>

              <v-text-field
                v-if="showNetworkAndAddress"
                v-model="toFromAddress"
                label="To/From Address"
                required
              ></v-text-field>

              <v-select
                v-model="deliveryMethod"
                :items="deliveryMethods"
                label="Delivery Method"
                :menu-props="darkmode ? 'dark' : 'light'"
                required
              ></v-select>

              <v-text-field
                v-model="deliveryUserId"
                label="Delivery User ID"
                required
              ></v-text-field>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" @click="closeDialog">Cancel</v-btn>
            <v-btn color="success" @click="submitForm" :disabled="!valid"
              >Create Beacon</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-dialog>

      <v-data-table
        :headers="headers"
        :items="jobs"
        class="elevation-1"
        style="background-color: transparent"
        no-data-text="Add your first Beacon to get started!"
      >
        <template v-slot:item.actions="{ item }">
          <v-icon size="20" @click="restartBeacon(item)">mdi-restart</v-icon>
          <v-icon size="20" @click="stopBeacon(item)">mdi-stop</v-icon>
          <v-icon size="20" @click="beaconInfo(item)">mdi-information</v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
  <v-container v-else>
    <div class="d-flex flex-column align-center my-12">
      <div
        class="d-flex flex-column align-center justify-center text-h4 mb-4 text-center"
        :class="[darkmode ? 'white--text' : 'grey--text text--darken-2']"
      >
        <v-icon
          size="30"
          :class="[darkmode ? 'white--text' : 'grey--text text--darken-2']"
        >
          mdi-account-off-outline
        </v-icon>
        Please Connect Your Wallet To Load Your Beacons!
      </div>
    </div></v-container
  >
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import axios from "axios";

export default {
  data() {
    return {
      dialog: false,
      valid: true,
      beaconTypes: ["Token Transfers From/To"], // Replace with your list of beacon types
      networks: ["ETH", "BSC", "MATIC", "ARB", "OSMOSIS"], // Replace with your list of networks
      deliveryMethods: ["Telegram"], // Replace with your list of delivery methods
      beaconType: "",
      network: "",
      toFromAddress: "",
      deliveryMethod: "",
      deliveryUserId: "",
      jobUpdater: null,
      jobs: [], // Array to store the list of jobs created by the user
    };
  },
  computed: {
    ...mapGetters("generalStore", [
      "compactView",
      "darkmode",
      "noLPPools",
      "round",
      "smallValues",
    ]),
    ...mapGetters("walletStore", ["connectedWallet", "connectedWalletShort"]),
    showNetworkAndAddress() {
      return this.beaconType === "Token Transfers From/To"; // Replace 'Type 1' with the beacon type that requires the network field
    },
    headers() {
      return [
        {
          text: "Beacon ID",
          value: "beacon_id",
        },
        {
          text: "Name",
          value: "name",
        },
        {
          text: "Status",
          value: "status",
        },
        {
          text: "Date",
          value: "date_done",
        },
        {
          text: "Actions", // Add the header cell for actions
          value: "actions", // The value is not a real property but acts as an identifier
          sortable: false, // You can set it as non-sortable since it's not a real data property
        },
      ];
    },
  },
  watch: {
    connectedWallet(newVal) {
      // If connectedWallet becomes true after the component is created, fetch jobs and start job updater
      if (newVal) {
        this.fetchJobs();
        this.startJobUpdater();
      } else {
        // If connectedWallet becomes false, stop the job updater
        this.stopJobUpdater();
      }
    },
  },
  created() {
    if (this.connectedWallet) {
      this.fetchJobs(); // Fetch jobs immediately when the component is created
      this.startJobUpdater(); // Start the job updater to automatically fetch jobs every X minutes
    }
  },
  methods: {
    startJobUpdater() {
      // Update jobs every 5 minutes (300,000 milliseconds)
      this.jobUpdater = setInterval(() => {
        this.fetchJobs();
      }, 60000);
    },
    stopJobUpdater() {
      clearInterval(this.jobUpdater); // Stop the job updater when the component is destroyed
    },
    openDialog() {
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
      this.resetForm();
    },
    updateFields() {
      // Reset network and To/From Address fields when Beacon Type changes
      this.network = "";
      this.toFromAddress = "";
    },
    resetForm() {
      this.$refs.form.reset();
      this.beaconType = "";
      this.network = "";
      this.toFromAddress = "";
      this.deliveryMethod = "";
      this.deliveryUserId = "";
    },
    fetchJobs() {
      // Replace 'your_jobs_api_endpoint' with the actual backend API endpoint for fetching jobs
      // Example using axios:
      axios
        .get(
          `${process.env.VUE_APP_BEACON_URL}user_beacons/${this.connectedWallet}`
        )
        .then((response) => {
          // Handle the successful response here
          this.jobs = response.data; // Update with the actual property name from the API response
        })
        .catch((error) => {
          console.log(error);
        });

      // For this example, let's simulate a successful response with fake job IDs

      console.log(this.jobs);
    },
    submitForm() {
      // Call the backend API to post the data
      const data = {
        user_id: this.connectedWallet,
        beacon_name: "tasks.beacon.user_token_transfers",
        beacon_args: {
          network: this.network.toLocaleLowerCase(),
          address: this.toFromAddress,
        },
        beacon_delivery: {
          name: this.deliveryMethod,
          id: this.deliveryUserId,
        },
      };

      // Replace 'your_backend_api_endpoint' with the actual backend API endpoint
      // Make an API call to post the data to the backend
      // Example using axios:
      axios
        .post(`${process.env.VUE_APP_BEACON_URL}create_beacon`, data)
        .then((response) => {
          this.fetchJobs();
          this.closeDialog();
        })
        .catch((error) => {
          console.log(error);
        });
    },
    stopBeacon(rowData) {
      axios
        .post(
          `${process.env.VUE_APP_BEACON_URL}stop_beacon/${rowData.beacon_id}`
        )
        .then((response) => {
          // Handle the successful response here
          this.$store.commit(
            "generalStore/ADD_ALERT",
            `${response.data.message}`,
            {
              root: true,
            }
          );
        })
        .catch((error) => {
          console.log(error);
        });

      this.fetchJobs();
    },
    restartBeacon(item) {
      console.log(item);
    },
    beaconInfo(item) {
      console.log(item);
    },
  },
  beforeDestroy() {
    this.stopJobUpdater(); // Clean up by stopping the job updater when the component is destroyed
  },
};
</script>

import SavvyFarmEcosystem from "./FarmSection/EcoSystem";
import SavvyFarmStatisticsDashboard from "./FarmSection/FarmChart";
import SavvyFarmMarketing from "./FarmSection/Marketing";
import SavvyFarmPools from "./FarmSection/Pools";
import SavvyFarmReferral from "./FarmSection/Referral";
import SavvyFarmRewardEmission from "./FarmSection/RewardEmission";


export default function Farm() {
    return (
        <section>
            <SavvyFarmPools />
            <SavvyFarmReferral />
            {/**
      <Portfolio />
      */}
            <SavvyFarmRewardEmission />
            {/**
      <SavvyFarmShop />
       */}
            <SavvyFarmStatisticsDashboard />
            <SavvyFarmMarketing />
            <SavvyFarmEcosystem />
        </section>
    )
}

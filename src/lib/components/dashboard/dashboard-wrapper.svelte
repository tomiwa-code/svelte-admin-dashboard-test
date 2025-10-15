<script lang="ts">
  import { users } from "../../stores/users.store";
  import SectionTitle from "../section-title.svelte";
  import DashboardCard from "./dashboard-card.svelte";

  const overviewStats = [
    { title: "Total Users", value: $users.length },
    { title: "Revenue", value: "$45,678" },
    { title: "Orders", value: "567" },
    { title: "Growth", value: "+12.5%" },
  ];
</script>

<div class="page">
  <SectionTitle title="Dashboard Overview" />
  <div class="stats-grid">
    {#each overviewStats as stat, idx (stat.title)}
      {@const { title, value } = stat}
      <DashboardCard {title} {value} delay={idx} />
    {/each}
  </div>
</div>

<style type="scss">
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
    margin-top: 2rem;
  }
</style>

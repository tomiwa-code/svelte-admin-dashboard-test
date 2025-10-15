<script lang="ts">
  import SectionTitle from "../section-title.svelte";
  import Searchbar from "./searchbar.svelte";
  import UserTable from "./user-table.svelte";

  let searchTerm = $state("");
</script>

<div class="page">
  <SectionTitle title="Users" />
  <Searchbar
    bind:value={searchTerm}
    placeholder="Search users by name, email, or role..."
  />
  <UserTable {searchTerm} />
</div>

<style>
  .page {
    display: flex;
    flex-direction: column;
  }
</style>

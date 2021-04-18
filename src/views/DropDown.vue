<template>
  <div class="dropdown-page">
    <Dropdown @visible-change='handleVisibleChange'>
      <template #trigger>
        <button>Inline</button>
      </template>

      <h3>666</h3>

    </Dropdown>
    <hr />
    <br>
    <br>
    <Dropdown
      @visible-change='handleVisibleChange'
      :block='true'
    >
      <template #trigger>
        <button>FullWidth</button>
      </template>

      <h3>666</h3>

    </Dropdown>
    <hr />
    <br>
    <br>

    <Dropdown
      align='right'
      @visible-change='handleVisibleChange'
    >
      <template #trigger>
        <button>Right</button>
      </template>

      <h3>666</h3>

    </Dropdown>
    <hr />
    <br>
    <br>

    <Dropdown
      :width='200'
      align='center'
      @visible-change='handleVisibleChange'
    >
      <template #trigger>
        <button>Center</button>
      </template>

      <h3>666</h3>
    </Dropdown>
    <hr />
    <br>
    <br>

    <Dropdown
      :width='200'
      :embed='true'
      align='center'
      @visible-change='handleVisibleChange'
    >
      <template #trigger>
        <button>embed</button>
      </template>

      <h3>666</h3>
    </Dropdown>
    <hr />
    <br>
    <br>

    <Dropdown
      :width='200'
      :manual='true'
      align='center'
      @visible-change='handleVisibleChange'
      ref='dropdown'
    >
      <template #trigger>
        <button>Manual</button>
      </template>
      <h3>666</h3>
    </Dropdown>
    <hr />
    <br>
    <br>

    <Dropdown
      :width='200'
      :border='false'
      align='center'
      @visible-change='handleVisibleChange'
    >
      <template #trigger>
        <button>No border</button>
      </template>
      <h3>666</h3>
    </Dropdown>
    <hr />
    <br>
    <br>

    <Dropdown
      :width='200'
      :rightClick='true'
      align='center'
      @visible-change='handleVisibleChange'
    >
      <template #trigger>
        <button>RightClick</button>
      </template>

      <h3>666</h3>
    </Dropdown>
    <hr />
    <br>
    <br>

    <button @click.stop='handleClick'>Manual</button>
  </div>
</template>
<script>
import Dropdown from '@/components/Dropdown'

export default {
  components: {
    Dropdown
  },

  methods: {
    handleVisibleChange (visible) {
      console.log(visible)
    },

    handleClick () {
      this.$refs.dropdown.show(true)
    }
  },

  mounted () {

  }
}
</script>

<style>
</style>

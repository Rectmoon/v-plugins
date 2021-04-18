<template>
  <div id="root">
    <div id="nav">
      <router-link to="/dropdown">Dropdown</router-link>
    </div>
    <router-view class='view' />
  </div>
</template>

<style>
#nav {
  position: fixed;
  left: 0;
  top: 0;
  background: rgba(0, 0, 0, 0.8);
  width: 100%;
  height: 100%;
  width: 200px;
}

#nav a {
  display: block;
  text-decoration: none;
  line-height: 40px;
  color: #fff;
  text-align: center;
}

#nav a:hover {
  background: rgba(0, 0, 0, 0.7);
}

.view {
  margin-left: 200px;
}
</style>

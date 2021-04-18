<template>
  <div
    :class='wrapperClassNames'
    @click.stop='handleClick'
    @contextmenu="handleContextmenu"
  >
    <!-- trigger -->
    <slot
      name='trigger'
      v-if='!embed'
    ></slot>
    <!-- trigger -->

    <!-- pannel -->
    <transition :name='animateName'>
      <div
        ref='dropdown'
        :class='dropdownPanelClassNames'
        :style='dropdownPanelStyle'
        v-show='visible'
        @click.stop
      >
        <slot></slot>
      </div>
    </transition>
    <!-- pannel -->
  </div>
</template>

<script>
import { getEventPath } from '@/utils/dom'

export default {
  props: {
    disabled: {
      type: Boolean,
      default: false
    },

    manual: {
      type: Boolean,
      default: false
    },

    rightClick: {
      type: Boolean,
      default: false
    },

    toggle: {
      type: Boolean,
      default: true
    },

    block: {
      type: Boolean,
      default: false
    },

    embed: {
      type: Boolean,
      default: false
    },

    border: {
      type: Boolean,
      default: true
    },

    animated: {
      type: [String, Boolean],
      default: true
    },

    align: {
      type: String,
      default: 'left'
    },

    width: Number
  },

  data () {
    return {
      visible: false,
      dropdownPanelTop: '',
      dropdownPanelLeft: '',
      dropUp: false,
      x: null,
      y: null
    }
  },

  computed: {
    wrapperClassNames () {
      return {
        'v-dropdown-wrapper': true,
        block: this.block
      }
    },

    dropdownPanelClassNames () {
      return {
        'v-dropdown-container': true,
        'v-dropdown-embed': this.embed,
        'v-dropdown-no-border': !this.border
      }
    },

    dropdownPanelStyle () {
      const { dropdownPanelTop, dropdownPanelLeft, width } = this
      const style = { top: dropdownPanelTop, left: dropdownPanelLeft }

      if (width) {
        style.width = width + 'px'
      }

      return style
    },

    animateName () {
      if (typeof this.animated === 'string') return this.animated
      if (!this.embed && this.animated) return this.dropUp ? 'animate-up' : 'animate-down'
      return ''
    }
  },

  methods: {
    handleClick (e) {
      if (this.embed || this.rightClick || this.manual) return
      this.show()
    },

    handleContextmenu (e) {
      if (this.embed || this.manual || !this.rightClick) return

      e.stopPropagation()
      e.preventDefault()

      const info = this.scrollInfo()
      this.x = e.pageX || (e.clientX + info.x)
      this.y = e.pageY || (e.clientY + info.y)

      this.show()
    },

    show (outside = false) {
      if (this.disabled) return
      if (this.visible && !this.toggle && !outside) return
      if (!this.visible && !this.embed && this.$slots.trigger) this.adjust()

      this.visible = !this.visible
      this.$emit('visible-change', this.visible)
    },

    adjust () {
      const pos = this.$el.getBoundingClientRect()
      let menu = null

      if (this.visible) menu = this.$refs.dropdown.getBoundingClientRect()
      else {
        this.$refs.dropdown.style.visibility = 'hidden'
        this.$refs.dropdown.style.display = 'inline-block'
        menu = this.$refs.dropdown.getBoundingClientRect()
        this.$refs.dropdown.style.visibility = 'visible'
        this.$refs.dropdown.style.display = 'none'
      }

      this.adjustTop(pos, menu)
      this.adjustLeft(pos, menu)
    },

    adjustTop (pos, menu) {
      const gap = 5
      const scrollTop = window.pageYOffset
      const viewHeight = document.documentElement.clientHeight
      const srcTop = this.rightClick ? this.y : pos.top + scrollTop
      let t = this.rightClick ? this.y : pos.top + scrollTop + pos.height + gap
      let overDown = false; let overUp = false; let up = false

      if ((t + menu.height) > (scrollTop + viewHeight)) overDown = true
      if ((srcTop - gap - menu.height) < scrollTop) overUp = true

      if (!overUp && overDown) {
        t = srcTop - gap - menu.height
        up = true
      }
      this.dropUp = up
      this.dropdownPanelTop = `${t}px`
    },

    adjustLeft (pos, menu) {
      const scrollLeft = window.pageXOffset
      const viewWid = document.documentElement.clientWidth
      const wid = this.rightClick ? 0 : pos.width

      const left = this.rightClick ? this.x : pos.left + scrollLeft
      const center = (left + (wid / 2)) - (menu.width / 2)
      const right = (left + wid) - menu.width
      let l = 0

      switch (this.align) {
        case 'left':
          l = (left + menu.width) > (scrollLeft + viewWid) ? right : left
          break
        case 'center':
          if ((center + menu.width) > (scrollLeft + viewWid)) l = right
          else if (right < scrollLeft) l = left
          else l = center
          break
        case 'right': l = (right < scrollLeft) ? left : right
          break
        default:
          break
      }

      this.dropdownPanelLeft = `${l}px`
    },

    scrollInfo () {
      const supportPageOffset = window.pageXOffset !== undefined
      const isCSS1Compat = ((document.compatMode || '') === 'CSS1Compat')

      return {
        x: supportPageOffset ? window.pageXOffset : isCSS1Compat ? document.documentElement.scrollLeft : document.body.scrollLeft,
        y: supportPageOffset ? window.pageYOffset : isCSS1Compat ? document.documentElement.scrollTop : document.body.scrollTop
      }
    },

    getEventPath (e) {
      if ('composedPath' in e) return e.composedPath()
      if ('path' in e) return e.path

      const path = []
      let currentElem = e.target

      while (currentElem) {
        path.push(currentElem)
        currentElem = currentElem.parentElement
      }

      if (path.indexOf(window) === -1 && path.indexOf(document) === -1) path.push(document)
      if (path.indexOf(window) === -1) path.push(window)

      return path
    },

    handleClickOutSide (e) {
      if (this.visible) {
        const inCaller = getEventPath(e).findIndex(val => val === this.$el) !== -1
        // const inCaller = this.$el.contains(e.target)

        if (inCaller && !this.toggle && !this.rightClick) return

        if (!inCaller || (inCaller && this.rightClick)) {
          this.show(true)
        }
      }
    }
  },

  mounted () {
    if (this.embed) {
      this.show()
    } else {
      document.body.appendChild(this.$refs.dropdown)
      document.body.addEventListener('click', this.handleClickOutSide)
    }
  },

  beforeUnmount () {
    if (!this.embed) {
      document.body.removeEventListener('click', this.handleClickOutSide)
      this.$refs.dropdown.remove()
    }
  },

  unmounted () {
    if (!this.embed) this.$el.remove()
  }
}
</script>

<style lang="stylus">
shadow(blur, transparent, v-shadow = 3px)
  -webkit-box-shadow 0 v-shadow blur rgba(0, 0, 0, transparent)
  -moz-box-shadow 0 v-shadow blur rgba(0, 0, 0, transparent)
  box-shadow 0 v-shadow blur rgba(0, 0, 0, transparent)

animation(start = -6px)
  -webkit-transform translateY(start)
  transform translateY(start)
  opacity 0

duration = 300ms
down = animate-down
up = animate-up

div.v-dropdown-wrapper
  display inline-block

  &.block
    display block

div.v-dropdown-container
  display inline-block
  margin 0
  padding 0
  top 0
  left 0
  border 1px solid #D6D7D7
  position absolute
  box-sizing border-box
  background-color white
  -webkit-border-radius 2px
  border-radius 2px
  overflow hidden
  z-index 3000
  shadow(12px, 0.2)
  will-change opacity, transform

  &.v-dropdown-embed
    position relative
    box-shadow 0 1px 6px rgba(0, 0, 0, 0.12) !important
    z-index 100

  &.v-dropdown-no-border
    border 0
    shadow(8px, 0.3)

.{down}-enter, .{down}-leave-to
  animation()

.{up}-enter, .{up}-leave-to
  animation(6px)

.{down}-enter-active, .{down}-leave-active, .{up}-enter-active, .{up}-leave-active
  -webkit-transition opacity duration, transform duration
  transition opacity duration, transform duration

.{down}-enter-to, .{down}-leave, .{up}-enter-to, .{up}-leave
  -webkit-transform none
  transform none
  opacity 1
</style>

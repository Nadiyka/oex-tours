<template>
    <div class="dropdown-menu" @click="toggleMenu" v-on-clickaway="closeMenu">
        Валюта: {{currency}}
        <div class="sort">
            <i class="icon-arrow"></i>
        </div>
        <ul v-show="showMenu">
            <li>
                <input style="display:none" id="RUBTours" type="radio" value="RUB" v-model="currency" @click="changeCurrency">
                <label class="checkbox" for="RUBTours">RUB</label>
            </li>
            <li>
                <input style="display:none" id="EURTours" type="radio" value="EUR" v-model="currency" @click="changeCurrency">
                <label class="checkbox" for="EURTours">EUR</label>
            </li>
        </ul>
    </div>
</template>
<script>
    import { directive as onClickaway } from 'vue-clickaway';
    export default {
        name: 'price',
        data() {
            return {
                currency: 'RUB',
                showMenu: false
            }
        },
        methods: {
            changeCurrency() {

            },
            toggleMenu() {
                this.showMenu = !this.showMenu;
            },
            closeMenu() {
                this.showMenu = false;
            }
        },
        directives: {
            onClickaway: onClickaway,
        }
    }
</script>
<style lang="scss"></style>
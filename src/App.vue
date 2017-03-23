<template>
    <div>
        <el-button type="primary" @click.native="requestGet">发送请求</el-button>
    </div>
</template>

<script>
    export default {
        name: 'App',
        data () {
            return {
                msg: 'App.vue'
            }
        },
        methods: {
            requestGet () {
                this.$http.get('http://localhost:8015/api/Admin/Authority/GetUserAuthority/330f6b95-c36a-4758-8686-b1ab1fba7227').then(response => {
                    alert(response.status);
                }, response => {
                    alert(response.status);
                })
            }
        }
    }
</script>

<style>
    /*#app {*/
        /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
        /*-webkit-font-smoothing: antialiased;*/
        /*-moz-osx-font-smoothing: grayscale;*/
        /*text-align: center;*/
        /*color: #2c3e50;*/
        /*margin-top: 60px;*/
    /*}*/
</style>

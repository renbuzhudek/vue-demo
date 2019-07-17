import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
let routes = {
  routes: [
    {
      path: '/',
      redirect: '/HelloWorld'

    }, {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: () => import(/* webpackChunkName: "HelloWorld" */'../components/HelloWorld.vue')
    }, {
      path: '/tableDemo',
      name: 'tableDemo',
      component: {
        template: `  <router-view ></router-view>`
      }, // ()=>import(/* webpackChunkName: "tableDemo" */'../pages/tableDemo.vue'),
      redirect: '/tableDemo/table',
      children: [
        {
          path: 'table',
          name: 'table',
          redirect: '/tableDemo/table/ttttt',
          component: {
            template: `  <router-view ></router-view>`
          },
          // ()=>import(/* webpackChunkName: "tableDemo" */'../pages/tableDemo.vue'),
          children: [
            {
              path: 'ttttt',
              name: 'ttttt',
              component: () => import(/* webpackChunkName: "tableDemo" */'../pages/tableDemo.vue')

            }
          ]
        }
      ]
    },
    {
      path: '/demoRx',
      name: 'demoRx',
      component: () => import(/* webpackChunkName: "demoRx" */'../pages/demoRx.vue')
    },
    {
      path: '/select/:id',
      name: 'select',
      component: () => import(/* webpackChunkName: "select" */'../pages/select.vue')
    },
    {
      path: '/selects',
      name: 'selects',
      component: () => import(/* webpackChunkName: "selects" */'../pages/selects.vue')
    },
    {
      path: '/uploadDemo',
      name: 'uploadDemo',
      component: () => import(/* webpackChunkName: "uploadDemo" */'../components/uploadDemo.vue')
    }
  ]
}
export default new Router(routes)

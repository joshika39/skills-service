import AdminHomePage from '@/components/AdminHomePage.vue'
import MyProjects from '@/components/projects/MyProjects.vue'
import QuizDefinitionsPage from '@/components/quiz/QuizDefinitionsPage.vue'
import UserActionsPage from '@/components/userActions/UserActionsPage.vue'
import MultipleProjectsMetricsPage from '@/components/metrics/multipleProjects/MultipleProjectsMetricsPage.vue'
import EmaillProjectAdmins from '@/components/projects/EmaillProjectAdmins.vue'

const createAdminRoutes = () => {
  return {
    path: '/administrator',
    component: AdminHomePage,
    meta: {
      requiresAuth: true,
      announcer: {
        message: 'Project Administrator'
      }
    },
    children: [
      {
        name: 'AdminHomePage',
        path: '',
        component: MyProjects,
        meta: {
          requiresAuth: true,
          announcer: {
            message: 'Project Administrator'
          }
        }
      }, {
        name: 'QuizzesAndSurveys',
        path: 'quizzes',
        component: QuizDefinitionsPage,
        meta: {
          requiresAuth: true,
          announcer: {
            message: 'Quizzes and Surveys',
          },
        },
      }, {
        name: 'UserActions',
        path: 'userActions',
        component: UserActionsPage,
        meta: {
          requiresAuth: true,
          announcer: {
            message: 'User Actions History',
          },
        },
      }, {
        name: 'MultipleProjectsMetricsPage',
        path: 'metrics',
        component: MultipleProjectsMetricsPage,
        meta: {
          requiresAuth: true,
          announcer: {
            message: 'All Projects Metrics',
          },
        },
      }, {
        name: 'ContactAdmins',
        path: 'contactAdmins',
        component: EmaillProjectAdmins,
        meta: {
          requiresAuth: true,
          announcer: {
            message: 'Contact Project Admins',
          },
        },
      },
    ]
  }
}

export default createAdminRoutes

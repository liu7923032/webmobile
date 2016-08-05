'use strict'

import Project from './views/project/Index.vue'
import ProjectInfo from './views/project/ProjectInfo.vue'
import UpFile from './views/project/UpFile.vue'

import Index from './views/Index.vue'
import LogInfo from './views/worklog/LogInfo.vue'
import LogDetail from './views/worklog/LogDetail.vue'

import CService from './views/cservice/Index.vue'
import NewCSWork from './views/cservice/NewCSWork.vue'
import WorkFlow from './views/workflow/Index.vue'
import Notice from './views/notice/Index.vue'
import Known from './views/known/Index.vue'
import WorkLog from './views/worklog/Index.vue'

export default function(router) {
    router.map({
        '/': { //首页
            name: 'index',
            auth: true,
            component: Index
        },
        // 首页
        '/index': {
            name: 'index',
            auth: true,
            component: Index
        },
        // 项目
        '/project': {
            name: 'project',
            auth: true,
            component: Project
        },
        '/project/projectinfo/:id':{
            name: 'proinfo',
            auth: true,
            component: ProjectInfo
        },
        '/project/upfile/:id':{
            name:'upfile',
            auth:true,
            component:UpFile
        },
        //客服
        '/cservice':{
            name: 'cservice',
            auth: true,
            component: CService
        },
         //客服
        '/cservice/newcswork':{
            name: 'newcswork',
            auth: true,
            component: NewCSWork
        },
        // 工作日志
        '/worklog': {
            name: 'worklog',
            auth: true,
            component: WorkLog
        },
        '/worklog/loginfo/:date':{
            name:'loginfo',
            auth: true,
            component: LogInfo
        },
        '/worklog/logdetail/:date':{
            name:'logdetail',
            auth: true,
            component: LogDetail
        },
        '/notice':{
            name:'notice',
            auth: true,
            component: Notice
        },
        '/notice/noticeinfo/:no':{
            name:'noticeinfo',
            auth: true,
            component: require('./views/notice/NoticeInfo.vue')
        },
        // 流程信息
        '/workflow': {
            name: 'workflow',
            auth: true,
            component: WorkFlow
        },
        // 登陆页面
        '/login': {
            name: 'login',
            component: require('./views/Login.vue')
        },
        // 知识分享
        '/known': {
            name: 'comment',
            auth: true,
            component: Known
        },
        /* 404路由 */
        '*': {
            name: 'index',
            auth: true,
            component: Index
        }

    })
}

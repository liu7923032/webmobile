

function FlowUtils(opts, ajaxHelper) {
    this.opts = options(opts);
    this.showNextUser = showNextUser;
    this.showProcess = showProcess;
    this.execFlow = execFlow;
    this.approve = approve;
    this.reject = reject;
    this.deliver = deliver;
    // 请求服务器
    this.ajaxHelper = ajaxHelper;
}

// 0：可配参数
function options(param) {
    var opts = {
        URL: {
            showUsers: "",
            load: "",
            process: "",
            exec: "",
        },
        instNo: "",
        events: {
            fail: function (errmsg) {

            },
            // 返回的用户数据
            userData: function (data) {

            },
            // 返回流程处理过程数据
            processData: function (data) {

            },
            // 流程处理结果成功事件
            success: function (data) {

            }
        },
        wfObj: {
            // 流程类别
            WFNo: "",
            // 来源（第三方的流程）
            SourcePK: "",
            // 流程编号（主键guid）
            FlowNo: "",
            // 流程标题
            FlowName: "",
            // 流程表单对象
            FlowJson: JSON.stringify({}),
            // 流程处理人
            ProcessUser: "",
            // 下一步骤
            NextStepNo: "",
            // 下一处理人（签核必填）
            NextUser: "",
            // 意见
            Comment: ""
        }
    }
    if (!param) return opts;
    else {
        Object.keys(param).forEach(key => {
            opts[key] = param[key];
        });
    }
    return opts;
}

// 1:加载下一步处理人
function showNextUser() {

    var url = this.opts.URL.showUsers || "WFlow/GetFlowNextUser";
    this.opts.wfObj.FlowNo = this.opts.instNo;

    this.ajaxHelper.post(url, JSON.stringify(this.opts.wfObj)).then(function (res) {
        console.log("加载下一步处理人,返回成功");
        if (typeof (this.opts.events.userData) == "function") {
            this.opts.events.userData(res.data);
        }
    }, function (error) {
        if (typeof (this.opts.events.fail) == "function") {
            this.opts.events.fail(error);
        }
    });
}

// 2:加载下一步签核人
function showProcess() {
    var url = this.opts.URL.showUsers || "QueryFlow/GetApproveRecord/" + this.opts.instNo;
    this.ajaxHelper.get(url).then(function (res) {
        console.log("加载签核过程,返回成功");
        if (typeof (this.opts.events.processData) == "function") {
            this.opts.events.processData(res.data);
        }
    }, function (error) {
        if (typeof (this.opts.events.fail) == "function") {
            this.opts.events.fail(error);
        }
    });

}

// 3：执行审批流
function execFlow() {
    var url = this.opts.URL.exec || "WFlow/ApproveFlow";
    this.ajaxHelper.post(url, this.opts.wfObj).then(function (res) {
        console.log("加载签核过程,返回成功");
        if (typeof (this.opts.events.processData) == "function") {
            this.opts.events.processData(res.data);
        }
    }, function (error) {
        if (typeof (this.opts.events.fail) == "function") {
            this.opts.events.fail(error);
        }
    });
}

// 4：签核
function approve() {
    // 加载
}

// 5：拒绝
function reject() {


}



// 6：转交
function deliver() {

}

export default FlowUtils;
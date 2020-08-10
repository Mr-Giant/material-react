import React, { PureComponent } from 'react'
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
import styled from 'styled-components'
import { CanvasBg } from '../../canvas'
import NoticeMessage from 'components/Notifications/NoticeMessage.jsx'
import {levelOneZindex,ClearFix,themeRgbaColor} from 'components/common-style';
import Button from "components/CustomButtons/Button.js";
import { fetchPermissionRoute, setLogin} from '../../store/modules/account/action'

const loginBtnBg = "#00acc1"
// login box
const LoginBgBox = styled(ClearFix)`
    position:fixed;
    width:100%;
    height:100%;
    z-index:${levelOneZindex};
    background-image: radial-gradient(ellipse farthest-corner at center top, ${themeRgbaColor} 0%, #000105 100%);
    cursor: move;
`
// login form
const FormBox = styled.div`
    width:260px;
    height:200px;
    position:absolute;
    left:0;
    top:0;
    right:0;
    bottom: 0;
    margin:auto;
    cursor:pointer;
`
const FormList = 
styled.div`position:relative;
    margin-bottom:12px;
    padding:6px 0;
    background:#fff;
    input{
        padding:6px 15px;
        font-size:14px;
        color:#aaa;
        cursor:pointer;
        background:#fff;
        border:none;
        outline:medium;
        &:focus+.line{
            transform:scaleX(1);
        }
    }
    .line{
        position:absolute;
        width:100%;
        height:4px;
        background:${loginBtnBg};
        left:0;
        top:0;
        transform:scaleX(0);
        transition:transform 200ms cubic-bezier(0.0, 0, 0.2, 1) 0ms;
    }`

class Login extends PureComponent {
  constructor(props) {
    super(props)
    this.state = {
      type: "text",
      userName: "",
      userPwd: "",
      message: null,
      messageType: null,
      animationName: null,
    }
    this.messageInfo = {
      success: {
        message: "登录成功",
        animationName: null
      },
      warning: {
        message: "用户名不能为空！",
        animationName: "slideInLeft"
      },
      error: {
        message: "密码不能为空！",
        animationName: "shake",
      },
    }
  }

  componentDidMount() {
    new CanvasBg("canvasMoveBg")
  }

  updateUserName = e => {
    const userName = e.target.value
    this.setState({ userName })
  }

  updateUserPwd = e => {
    const userPwd = e.target.value
    this.setState({ userPwd })
  }

  // 在聚焦时重置输入类型，以防止浏览器记住密码
  resetInputType = () => {
    const { type } = this.state
    const newType = type === "text" ? "password" : type
    this.setState({
      type: newType
    })
  }

  keyUpEnter = (e) => {
    const { keyCode } = e
    if (keyCode && keyCode === 13) {
      this.login(e)
    }
  }

  // 此处添加登陆逻辑（访问数据库登陆）
  login = (e) => {
    const { userName, userPwd } = this.state
    const zhReg = new RegExp("[\\u4E00-\\u9FFF]+", "g"); // 汉字检测
    if (!userName) {
      return this.showMessage("warning")
    }
    if (userName && zhReg.test(userName)) {
      return this.setState({
        messageType: "error",
        message: "Username cannot contain Chinese !",
        animationName: "bounce",
      })
    }
    if (!userPwd) {
      return this.showMessage("error")
    }
    if (userName && userPwd) {
      const { history } = this.props
      const permissionId = 6 // 权限控制
      const info = { userName, userPwd, permissionId }
      this.props.setLogin(info) //保存到sessionStorage并保存登录状态
      this.resetInputType() // input 设置默认状态
      this.props.fetchPermissionRoute(permissionId) // 根据权限获取路由
      history.push("/")  //返回主页 
    }
  }

  showMessage(messageType) {
    const { message, animationName } = this.messageInfo[messageType]
    this.setState({ messageType, message, animationName })
  }

  // 删除通知回调
  removeNotification = () => {
    this.setState({ message: null, type: null })
  }

  render() {
    const { type, userName, userPwd, message, messageType, animationName } = this.state
    return (
      <LoginBgBox>
        {message ? <NoticeMessage message={message} type={messageType} animation={animationName} removeAlert={this.removeNotification} /> : null}
        <canvas id="canvasMoveBg" />
        <FormBox>
          <FormList>
            <input className="user-name"
              autoComplete="off"
              type="text"
              value={userName}
              placeholder="账号"
              maxLength="10"
              onChange={this.updateUserName} />
            <div className="line" />
          </FormList>
          <FormList>
            <input className="user-pwd"
              autoComplete="off"
              type={type}
              value={userPwd}
              placeholder="密码"
              maxLength="10"
              onFocus={this.resetInputType}
              onChange={this.updateUserPwd}
              onKeyUp={this.keyUpEnter} />
            <div className="line" />
          </FormList>
          <Button style={{ width: "100%", fontSize: "14px" }} color="info" onClick={this.login}>登录</Button>
        </FormBox>
      </LoginBgBox>
    )
  }
}

const mapDispatchToProps = {
  fetchPermissionRoute,
  setLogin,
}

export default withRouter(connect(null, mapDispatchToProps)(Login))

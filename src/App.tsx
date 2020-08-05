import React, { useState, useEffect } from 'react'
import { Layout, Menu, Dropdown, Row } from 'antd';
import {
  SettingOutlined,
  MessageOutlined,
  HomeOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  BugOutlined,
  RocketOutlined
} from '@ant-design/icons';
import styled from 'styled-components'

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Redirect,
  useLocation,
} from "react-router-dom";

import Feedbacks from './pages/Feedbacks'
import Features from './pages/Features'
import WidgetConfig from './pages/WidgetConfig'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Signup from './pages/Signup'
import Setup from './pages/Setup'
import Properties from './pages/Properties'
import Account from './pages/Account'
import Integrations from './pages/Integrations'
import UserDropdown from './components/UserDropdown'
import PropertyDropdown from './components/PropertyDropdown'

import { useQueryUser } from './hooks/user'
import { useQueryProperties } from './hooks/property'

const { Header, Content, Footer, Sider } = Layout;


function PrivateRoute({ children, ...rest }: any) {
  const { loading, error, data } = useQueryUser()

  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (loading) return <div>loading...</div>
        return data?.currentUser ? (
          children
        ) : (
            <Redirect
              to={{
                pathname: "/login",
                state: { from: location }
              }}
            />
          )
      }
      }
    />
  );
}

function PublicRoute({ children, ...rest }: any) {
  const { loading, error, data } = useQueryUser()
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (loading) return <div>loading...</div>
        return data?.currentUser ? (
          <Redirect
            to={{
              pathname: "/",
            }}
          />
        ) : (
            children
          )
      }
      }
    />
  );
}

const App = () => {

  const [collapsed, setCollapsed] = useState(false)
  const { loading, error, data } = useQueryUser()
  const propertiesQuery = useQueryProperties()

  let location = useLocation();

  const onCollapse = (collapsed: boolean) => {
    setCollapsed(collapsed);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="logo">
          {collapsed ? <span style={{ fontSize: 'x-large' }}>🦨</span> : 'Moufette v0.1'}
        </div>
        <Menu theme="dark" mode="inline" defaultOpenKeys={['widget', 'widget-tabs']} defaultSelectedKeys={['/']} selectedKeys={[location.pathname]}>
          <Menu.Item key="/">
            <Link to="/">
              <HomeOutlined />
              <span>Home</span>
            </Link>
          </Menu.Item>


          <Menu.SubMenu key="widget" icon={<RocketOutlined />} title="Widget">

            <Menu.Item key="/widget/settings">
              <Link to="/widget/settings">
                <span>Settings</span>
              </Link>
            </Menu.Item>


            <Menu.Item key="/widget/feedbacks">
              <Link to="/widget/feedbacks">

                <span>Feedbacks</span>
              </Link>
            </Menu.Item>
            <Menu.Item key="/widget/features">
              <Link to="/widget/features">

                <span>Features</span>
              </Link>
            </Menu.Item>
          </Menu.SubMenu>



          <Menu.Item key="/properties">
            <Link to="/properties">
              <SettingOutlined />
              <span>Properties</span>
            </Link>
          </Menu.Item>

          <Menu.Item key="/setup">
            <Link to="/setup">
              <SettingOutlined />
              <span>Setup</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="/integrations">
            <Link to="/integrations">
              <SettingOutlined />
              <span>Integrations</span>
            </Link>
          </Menu.Item>
        </Menu>
      </Sider>

      <Layout className="site-layout" style={{ height: '100vh' }}>
        <Header className="site-layout-background" style={{ padding: 0 }}>
          <Row justify="space-between" align="middle">

            {
              React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                className: 'trigger',
                onClick: () => onCollapse(!collapsed),
              } as any)
            }

            <PropertyDropdown properties={propertiesQuery} />

            <span style={{ paddingRight: 24 }}>
              <UserDropdown currentUser={data?.currentUser} />
            </span>


          </Row>
        </Header>
        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow: 'auto'
          }}
        >
          <Route exact path="/">
            <Home />
          </Route>

          <Route path="/widget/settings">
            <WidgetConfig currentUser={data?.currentUser} />
          </Route>

          <Route path="/widget/feedbacks">
            <Feedbacks />
          </Route>

          <Route path="/widget/features">
            <Features />
          </Route>

          <Route path="/properties">
            <Properties />
          </Route>

          <Route path="/setup">
            <Setup currentUser={data?.currentUser} />
          </Route>

          <Route path="/integrations">
            <Integrations currentUser={data?.currentUser} />
          </Route>

          <Route path="/account">
            <Account currentUser={data?.currentUser} />
          </Route>
        </Content>
      </Layout>
    </Layout>

  )
}

const BasicExample = () => {

  return (
    <Router>
      <Switch>
        <PublicRoute path="/login">
          <Login />
        </PublicRoute>
        <PublicRoute path="/signup">
          <Signup />
        </PublicRoute>
        <PublicRoute path="/forgot-password">
          <ForgotPassword />
        </PublicRoute>
        <PrivateRoute>
          <App />
        </PrivateRoute>
      </Switch>
    </Router>
  );
}


function Home() {
  return (
    <div>
      <h2>Welcome to Moufette</h2>
      <h1>Steps</h1>
      <p>1. Go to <Link to="/widget">widget</Link> and choose your primary color and the app name to display for your visitors</p>
      <p>2. Add some <Link to="/features">features</Link> that your visitor can vote for</p>
      <p>3. Finally copy the JS snippet from <Link to="/setup">setup</Link> and add it to your site to activte the widget</p>
      <p>4. Get some cool <Link to="/feedbacks">feedbacks</Link>!</p>

    </div>
  );
}



export default BasicExample

import {useEffect, useState} from 'react';
import './App.css';
import {getAllStudents} from "./client";
import StudentDrawerForm from "./StudentDrawerForm";
import {Breadcrumb, Button, Empty, Layout, Menu, Spin, Table} from 'antd';

import {
    DesktopOutlined,
    FileOutlined,
    LoadingOutlined,
    PieChartOutlined,
    PlusOutlined,
    TeamOutlined,
    UserOutlined
} from '@ant-design/icons';
import {errorNotification} from "./Notification";

const {Header, Content, Footer, Sider} = Layout;
const {SubMenu} = Menu;

const columns = [
    {
        title: 'Id',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        key: 'gender',
    }
];

const antIcon = <LoadingOutlined style={{fontSize: 24}} spin/>;

function App() {
    // here we create an initial and empty  state
    const [students, setStudents] = useState([]);
    const [collapsed, setCollapsed] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [showDrawer, setShowDrawer] = useState(false);

    const fetchStudents = () =>
        getAllStudents()
            .then(response => response.json())
            .then(data => {
                console.log(data);
                setStudents(data);
                setFetching(false);
            }).catch(err => {
            console.log(err);
            err.response.json().then(res => {
                console.log(res);
                errorNotification("There was an issue",
                    `${res.message} [${res.status}] [${res.error}]`);
            });
        }).finally(() => setFetching(false));

    useEffect(() => {
        console.log("component is mounted ");
        fetchStudents();
    }, []);

    const renderStudents = () => {
        if (fetching) {
            return <Spin indicator={antIcon}/>;
        }

        if (students.length <= 0) {
            return <>
                <Button
                    onClick={() => setShowDrawer(!showDrawer)}
                    type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                    Add New Student
                </Button>
                <StudentDrawerForm
                    showDrawer={showDrawer}
                    setShowDrawer={setShowDrawer}
                    fetchStudents={fetchStudents}
                />
                <Empty/>
            </>
        }

        return <>
            <StudentDrawerForm
                showDrawer={showDrawer}
                setShowDrawer={setShowDrawer}
                fetchStudents={fetchStudents}
            />
            <Table
                dataSource={students}
                columns={columns}
                bordered
                title={() =>
                    <>
                        <Button
                            onClick={() => setShowDrawer(!showDrawer)}
                            type="primary" shape="round" icon={<PlusOutlined/>} size="small">
                            Add New Student
                        </Button>

                    </>
                }
                pagination={{pageSize: 50}}
                scroll={{y: 500}}
                rowKey={student => student.id}
            ></Table>
        </>

    } // renderStudents

    return (
        <Layout
            style={{
                minHeight: '100vh',
            }}
        >
            <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
                <div className="logo"/>
                <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline">
                    <Menu.Item key="1" icon={<PieChartOutlined/>}>
                        Option 1
                    </Menu.Item>
                    <Menu.Item key="2" icon={<DesktopOutlined/>}>
                        Option 2
                    </Menu.Item>
                    <SubMenu key="sub1" icon={<UserOutlined/>} title="User">
                        <Menu.Item key="3">Tom</Menu.Item>
                        <Menu.Item key="4">Bill</Menu.Item>
                        <Menu.Item key="5">Alex</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" icon={<TeamOutlined/>} title="Team">
                        <Menu.Item key="6">Team 1</Menu.Item>
                        <Menu.Item key="8">Team 2</Menu.Item>
                    </SubMenu>
                    <Menu.Item key="9" icon={<FileOutlined/>}>Files</Menu.Item>
                </Menu>
            </Sider>
            <Layout className="site-layout">
                <Header className="site-layout-background" style={{padding: 0}}/>
                <Content style={{margin: '0 16px'}}>
                    <Breadcrumb style={{margin: '16px 0'}}>
                        <Breadcrumb.Item>User</Breadcrumb.Item>
                        <Breadcrumb.Item>Bill</Breadcrumb.Item>
                    </Breadcrumb>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 260}}>
                        {renderStudents()}
                    </div>
                </Content>
                <Footer style={{textAlign: 'center'}}>By Rurutia1027</Footer>
            </Layout>
        </Layout>
    )
        ;
}

export default App;

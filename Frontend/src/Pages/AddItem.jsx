import React from 'react';
import { Form, Input, Button, Layout, Menu, Select, message, Card } from 'antd'; // Added Select
import { HomeOutlined, UnorderedListOutlined } from '@ant-design/icons';
import { ShoppingCartOutlined,  AuditOutlined } from '@ant-design/icons';

import { categories } from '../Constants/Categories';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addItem } from '../Redux/itemsSlice' // Ensure this path matches your folder structure

const { Header, Content } = Layout;
const { TextArea } = Input;
const { Option } = Select;

const AddItem = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  
  // Navigation Items
  const menuItems = [
    { key: 'home', label: 'Dashboard', icon: <HomeOutlined />, onClick: () => navigate('/') },
    { key: 'list', label: 'Make Order', icon: <ShoppingCartOutlined />, onClick: () => navigate('/make-order') },
     { key: 'list', label: 'Review Order', icon: <AuditOutlined/>, onClick: () => navigate('/review-order') },
  ];

  const onFinish = (values) => {
    // New Code
const newItem = {
  // NO ID! MongoDB generates the ID for us now.
  category: values.category,
  name: values.name,
  description: values.description || '',
  dateAdded: new Date().toISOString(),
};

// Dispatch the async action
dispatch(addItem(newItem)).unwrap().then(() => {
   message.success('Item saved to Cloud Database!');
   form.resetFields();
}).catch((err) => {
   message.error('Failed to save item: ' + err.message);
});
    // message.success('Item added successfully!');
    form.resetFields();
  };

  return (
    <Layout className="layout" style={{ minHeight: '100vh' }}>
      <Header style={{ display: 'flex', alignItems: 'center' ,justifyContent: 'space-between',width: '100%'}}>
        {/* <div style={{ color: 'white', fontSize: '18px', marginRight: '30px', fontWeight: 'bold' }}>
          StockApp
        </div> */}
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={['2']}
          items={menuItems}
          style={{ flex: 1, minWidth: 0 }}
        />
      </Header>

      <Content style={{ padding: '50px' }}>
        <div className="site-layout-content" style={{ maxWidth: '600px', margin: '0 auto' }}>
          <Card title="Add New Item" bordered={false} style={{ boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
            
            <Form
              form={form}
              layout="vertical"
              onFinish={onFinish}
              autoComplete="off"
            >
              {/* UPDATED: Category Dropdown */}
              <Form.Item
                label="Category"
                name="category"
                rules={[{ required: true, message: 'Please select a category!' }]}
              >
                <Select placeholder="Select a category">
                  {categories.map((cat) => (
                    <Option key={cat} value={cat}>
                      {cat}
                    </Option>
                  ))}
                </Select>
              </Form.Item>

              {/* Item Name (Mandatory) */}
              <Form.Item
                label="Item Name"
                name="name"
                rules={[{ required: true, message: 'Please input the item name!' }]}
              >
                <Input placeholder="e.g., Wireless Mouse" />
              </Form.Item>

              {/* Description (Small Box) */}
              <Form.Item
                label="Description"
                name="description"
              >
                <TextArea 
                  rows={2} 
                  placeholder="Optional details..." 
                  maxLength={100} 
                  showCount
                />
              </Form.Item>

              <Form.Item>
                <Button type="primary" htmlType="submit" block size="large">
                  Save Item
                </Button>
              </Form.Item>
            </Form>

          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default AddItem;

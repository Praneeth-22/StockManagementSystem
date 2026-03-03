import React, { useState, useEffect } from "react";
import {
  Layout,
  Menu,
  Card,
  Button,
  Typography,
  Modal,
  Row,
  Col,
  Badge,
  message,
  Spin,
} from "antd";

import {
  HomeOutlined,
  PlusCircleOutlined,
  AuditOutlined,
  InfoCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  SaveOutlined,
  LoadingOutlined,
} from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { categories } from "../Constants/Categories";
import { submitOrder } from "../Redux/OrdersSlice";
import { fetchItems } from "../Redux/itemsSlice";

const { Header, Content, Footer } = Layout;
const { Title } = Typography;

const MakeOrder = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const antIcon = <LoadingOutlined style={{ fontSize: 40 }} spin />;

  /* ===============================
     Redux State
  =============================== */
  const { items: allItems, status, error } = useSelector(
    (state) => state.inventory
  );

  useEffect(() => {
    dispatch(fetchItems());
  }, [dispatch]);

  /* ===============================
     Navigation Menu
  =============================== */
  const menuItems = [
    {
      key: "home",
      label: "Dashboard",
      icon: <HomeOutlined />,
      onClick: () => navigate("/"),
    },
    {
      key: "add",
      label: "Add Item",
      icon: <PlusCircleOutlined />,
      onClick: () => navigate("/add-item"),
    },
    {
      key: "review",
      label: "Review Order",
      icon: <AuditOutlined />,
      onClick: () => navigate("/review-order"),
    },
  ];

  /* ===============================
     Cart State
     Format: { itemId: quantity }
  =============================== */
  const [cart, setCart] = useState({});

  const updateQuantity = (itemId, change) => {
    setCart((prev) => {
      const currentQty = prev[itemId] || 0;
      const newQty = Math.max(0, currentQty + change);

      if (newQty === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }

      return { ...prev, [itemId]: newQty };
    });
  };

  /* ===============================
     Save Order
  =============================== */
  const handleSaveOrder = () => {
    if (Object.keys(cart).length === 0) {
      message.warning("Please select at least one item.");
      return;
    }

    const orderItems = Object.entries(cart).map(([itemId, qty]) => {
      const itemDetails = allItems.find((i) => i._id === itemId);
      return { ...itemDetails, qty };
    });

    const newOrder = {
      date: new Date().toISOString(),
      items: orderItems,
      totalItems: orderItems.reduce((acc, item) => acc + item.qty, 0),
    };

    dispatch(submitOrder(newOrder))
      .unwrap()
      .then(() => {
        message.success("Order saved to Cloud successfully!");
        setCart({});
        navigate("/review-order");
      })
      .catch((err) => {
        message.error("Failed to save order: " + err.message);
      });
  };

  /* ===============================
     Description Modal
  =============================== */
  const showDescription = (item) => {
    Modal.info({
      title: item.name,
      content: (
        <div>
          <p>
            <strong>Category:</strong> {item.category}
          </p>
          <p>
            <strong>Details:</strong>{" "}
            {item.description || "No description available."}
          </p>
        </div>
      ),
      maskClosable: true,
    });
  };

  /* ===============================
     Render
  =============================== */
  return (
    <Layout style={{ minHeight: "100vh" }}>
      {/* Header */}
      <Header
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["home"]}
          items={menuItems}
          style={{ flex: 1 }}
        />
      </Header>

      {/* Content */}
      <Content style={{ padding: "20px", paddingBottom: "90px" }}>
        {/* Loading State */}
        {status === "loading" && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              minHeight: "50vh",
            }}
          >
            <Spin
              indicator={antIcon}
              tip="Connecting to database..."
              size="large"
            />
            <div style={{ marginTop: "15px", color: "#8c8c8c" }}>
              Render free servers may take a few seconds to wake up.
            </div>
          </div>
        )}

        {/* Error State */}
        {status === "failed" && (
          <div style={{ textAlign: "center", marginTop: "50px" }}>
            <Title level={4} style={{ color: "red" }}>
              Failed to load items
            </Title>
            <p>{error}</p>
          </div>
        )}

        {/* Items */}
        {status === "succeeded" &&
          categories.map((category) => {
            const categoryItems = allItems.filter(
              (item) => item.category === category
            );

            if (categoryItems.length === 0) return null;

            return (
              <div key={category} style={{ marginBottom: "30px" }}>
                <Title
                  level={3}
                  style={{
                    borderLeft: "4px solid #1890ff",
                    paddingLeft: "10px",
                  }}
                >
                  {category}
                </Title>

                <Row gutter={[16, 16]}>
                  {categoryItems.map((item) => {
                    const qty = cart[item._id] || 0;

                    return (
                      <Col xs={24} sm={12} md={12} lg={8} key={item._id}>
                        <Badge count={qty} offset={[-5, 5]}>
                          <Card
                            hoverable
                            style={{
                              borderRadius: "8px",
                              border:
                                qty > 0
                                  ? "1px solid #1677ff"
                                  : "1px solid #f0f0f0",
                              backgroundColor:
                                qty > 0 ? "#f0f5ff" : "#fff",
                              transition: "all 0.3s ease",
                            }}
                            bodyStyle={{ padding: "16px" }}
                          >
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                              }}
                            >
                              {/* Item Name */}
                              <div
                                style={{
                                  flex: 1,
                                  display: "flex",
                                  alignItems: "center",
                                  overflow: "hidden",
                                }}
                              >
                                <span
                                  style={{
                                    fontWeight: 600,
                                    whiteSpace: "nowrap",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                  }}
                                >
                                  {item.name}
                                </span>

                                <InfoCircleOutlined
                                  style={{
                                    marginLeft: 8,
                                    color: "#bfbfbf",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    showDescription(item);
                                  }}
                                />
                              </div>

                              {/* Controls */}
                              <div
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 8,
                                }}
                              >
                                <Button
                                  shape="circle"
                                  size="small"
                                  icon={<MinusOutlined />}
                                  disabled={qty === 0}
                                  onClick={() =>
                                    updateQuantity(item._id, -1)
                                  }
                                />

                                <span
                                  style={{
                                    fontWeight: "bold",
                                    minWidth: "24px",
                                    textAlign: "center",
                                    color:
                                      qty > 0 ? "#1677ff" : "#000",
                                  }}
                                >
                                  {qty}
                                </span>

                                <Button
                                  shape="circle"
                                  size="small"
                                  type={qty > 0 ? "primary" : "default"}
                                  icon={<PlusOutlined />}
                                  onClick={() =>
                                    updateQuantity(item._id, 1)
                                  }
                                />
                              </div>
                            </div>
                          </Card>
                        </Badge>
                      </Col>
                    );
                  })}
                </Row>
              </div>
            );
          })}
      </Content>

      {/* Footer */}
      <Footer
        style={{
          position: "fixed",
          bottom: 0,
          width: "100%",
          padding: "10px 20px",
          background: "#fff",
          boxShadow: "0 -2px 8px rgba(0,0,0,0.1)",
          textAlign: "center",
        }}
      >
        <Button
          type="primary"
          icon={<SaveOutlined />}
          size="large"
          onClick={handleSaveOrder}
          style={{
            width: "100%",
            maxWidth: "400px",
            height: "50px",
            fontSize: "18px",
          }}
        >
          Save Order (
          {Object.values(cart).reduce((a, b) => a + b, 0)} Items)
        </Button>
      </Footer>
    </Layout>
  );
};

export default MakeOrder;
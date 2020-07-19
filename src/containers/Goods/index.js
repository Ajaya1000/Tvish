import React from "react";
import Panel from "@/components/Panel";
import GoodCard from "@/components/GoodCard";
import { Row, Col, Icon, Layout, Button, Pagination } from "antd";
import UpdateGoodModal from "./UpdateGoodModal";
import AddGoodModal from "./AddGoodModal";
import BePutInStorage from "./BePutInStorage";
import DecreaseInventory from "./DecreaseInventory";
import SelectorHeader from "./SelectorHeader";
import {
  importGoods,
  getImageURL
} from "../../firebase";
const { Body } = Panel;

export default class Goods extends React.Component {
  state = {
    filteredInfo: null,
    sortedInfo: null,
    addFormVisible: false,
    updateFormVisible: false,
    putInFormVisible: false,
    decreaseFormVisible: false,
    currentGood: null,
    searchGood: null,
    currentPage: 1,
    goodList: [],
    goodsPerPage: 100,
    lastNode: null,
  };
  fetchProducts = () => {
   importGoods(
      this.state.currentPage,
      this.state.goodsPerPage,
      this.state.lastNode
    ).then(ans =>{
      console.log(ans);
      this.setState({
        goodList: ans,
      })
      ans.forEach((item,index,arr)=>{
        const itemId= arr[index].id;
       getImageURL(itemId).then((url)=>{
          arr[index].url = url;
          console.log('url of '+ itemId+" "+url)
            this.setState({
              goodList: arr,
            })
       });
        
      })
      
    })
    
  };
  componentDidMount() {
    this.fetchProducts();
  }
  handleAddModalShow = () => {
    this.setState({
      addFormVisible: true,
    });
  };

  handleUpdateModalShow = (good) => {
    this.setState({
      currentGood: good,
      updateFormVisible: true,
    });
  };

  handlePutInShow = (good) => {
    this.setState({
      putInFormVisible: true,
      currentGood: good,
    });
  };

  handleDecreaseShow = (good) => {
    this.setState({
      decreaseFormVisible: true,
      currentGood: good,
    });
  };

  handleCancel = () => {
    this.setState({
      addFormVisible: false,
      updateFormVisible: false,
      putInFormVisible: false,
      decreaseFormVisible: false,
    });
    this.fetchProducts();
  };

  renderGood = () => {
    const goods = this.state.goodList ? this.state.goodList : [];
    const processedGoods = [];
    const goodList = [];
    for (let i = 0, len = goods.length; i < len; ) {
      if (i === 0) {
        processedGoods.push([null, ...goods.slice(0, 2)]);
        i += 2;
        continue;
      }

      processedGoods.push(goods.slice(i, i + 3));
      i += 3;
    }

    processedGoods.map((row, rowId) => {
      const rows = [];
      row.map((item, itemId) => {
        if (null !== item) {
          console.log(item.url);
          rows.push(
            <GoodCard
              good={item}
              key={itemId}
              handleEdit={this.handleUpdateModalShow}
              handleIncrease={this.handlePutInShow}
              handleDecrease={this.handleDecreaseShow}
            />
          );
        } else {
          rows.push(
            <Col span={8} key={itemId} style={{ padding: "8px" }}>
              <Button
                className="good-card-add"
                onClick={this.handleAddModalShow}
              >
                <span>
                  <Icon type="plus" /> Add Good
                </span>
              </Button>
            </Col>
          );
        }
      });

      goodList.push(
        <Row gutter={16} key={rowId}>
          {rows}
        </Row>
      );
    });

    if (goodList.length > 0) {
      return goodList;
    } else {
      goodList.push(
        <Row gutter={16} key={1}>
          <Col span={8} key={2} style={{ padding: "8px" }}>
            <Button className="good-card-add" onClick={this.handleAddModalShow}>
              <span>
                <Icon type="plus" /> Adding goods
              </span>
            </Button>
          </Col>
        </Row>
      );
      return goodList;
    }
  };

  render() {
    let goodList = this.renderGood();
    goodList = goodList ? goodList : [];

    return (
      <Layout.Content
        style={{
          backgroundColor: "transparent",
        }}
      >
        <Panel minus>
          <SelectorHeader handleSelectorChange={this.handleSelectorChange} />
          <Panel.Body>
            {goodList.length > 0
              ? goodList.map((item) => {
                  return item;
                })
              : ""}
            <AddGoodModal
              visible={this.state.addFormVisible}
              isUploading={this.props.isUploading}
              handleCancel={this.handleCancel}
              handleSubmit={this.handleCreateSuccess}
            />
            <UpdateGoodModal
              visible={this.state.updateFormVisible}
              updateForm={this.state.currentGood}
              handleSubmit={this.handleUpateSuccess}
              handleCancel={this.handleCancel}
            />
            <BePutInStorage
              visible={this.state.putInFormVisible}
              good={this.state.currentGood}
              handleSubmit={this.handleUpInSuccess}
              handleCancel={this.handleCancel}
            />
            <DecreaseInventory
              visible={this.state.decreaseFormVisible}
              good={this.state.currentGood}
              handleSubmit={this.handleDecreaseSuccess}
              handleCancel={this.handleCancel}
            />
            <Pagination
              defaultCurrent={this.state.currentPage}
              total={this.props.total}
              defaultPageSize={8}
              onChange={this.handlePageChange}
              style={{
                textAlign: "center",
                marginTop: "30px",
              }}
            />
          </Panel.Body>
        </Panel>
      </Layout.Content>
    );
  }
}

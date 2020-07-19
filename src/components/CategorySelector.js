import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  fetchCategories,
  fetchAllCategorySecond
} from '../actions';
import {
  Select,
  Spin
} from 'antd';
import categories from '../reducers/categories';
import { db, auth } from '../firebase';

const Option = Select.Option


// @connect(
//   state => ({
//     firstIsFetching: state.categories.first.isFetching,
//     categoryFirst: state.categories.first.categories,
//     secondIsFetching: state.categories.second.isFetching,
//     categorySecond: state.categories.second.categories
//   }),
//   dispatch => ({
//     fetchCategoryFirst: () => dispatch(fetchCategories()),
//     fetchCategorySecond: () => dispatch(fetchAllCategorySecond())
//   })
// )
export default class CategorySelector extends React.Component {
  // static defaultProps = {
  //   isFetching: PropTypes.bool.isRequired,
  //   categoryFirst: PropTypes.array.isRequired,
  //   categorySecond: PropTypes.array.isRequired,
  //   allItem: PropTypes.bool.isRequired,
  //   level: PropTypes.oneOf(['first', 'second'])
  // }

  constructor(props) {
    super(props)
    // const value = this.props.value || ''
    this.state = {
      categories: [],
      value:this.props.value,
      isLoading: true
    }
  }

  componentDidMount() {
    console.log('component didmount called')
    this.fetchCategories()
  }

  fetchCategories = async ()=> {
    // console.log(auth().currentUser);
    console.log('fetch categories callled')
    var categoryRef = db.ref('categories')
    console.log(categoryRef);
    let catlist;
   await categoryRef.once('value',snapshot => {
      catlist = snapshot.val();
      // console.log(catlist);
      // let newList = []
      // catlist.map((item)=>{
      //   newList.push(item);
      // })
    })
    this.setState({
      categories : catlist,
      isLoading: false
    })
    // console.log(catlist);
  //  var userId = auth.currentUser.uid;
  //  let productRef = db.ref('users/'+userId+'/products');
  // //  let productImageRef = db.r
  //  productRef.on('value',snapshot => {
  //    let products = snapshot.val();
  //    let newCategories = [];
  //    for(let itemId in products){
  //      newCategories.push(
  //           {
  //             Id: itemId,
  //             name : products[itemId].name,
  //             categori
  //            }
  //         )
  //    }
  //  })

  }
  // fetchCategories = () => {
  //   const {
  //     level
  //   } = this.props

  //   if (level === 'first') {
  //     this.props.fetchCategoryFirst()
  //   }

  //   if (level === 'second') {
  //     this.props.fetchCategorySecond()
  //   }
  // }

  // componentWillReceiveProps(nextProps) {
  //   // Should be a controlled component.
  //   if ('value' in nextProps) {
  //     const value = nextProps.value;
  //     this.setState({
  //       value
  //     });
  //   }
  // }

  handleChange = (value) => {
    // if (!('value' in this.props)) {
      this.props.onChange(value);
    // }
    // this.triggerChange(value)
  }

  // handleBlur = () => {
  //   console.log('blur');
  // }

  // handleFocus = () => {
  //   console.log('focus');
  // }

  // triggerChange = (changedValue) => {
  //   const onChange = this.props.onChange;
  //   if (onChange) {
  //     onChange(changedValue)
  //   }
  // }

  renderCategory = () => {
    var categories = this.state.categories;
    console.log(categories);
    return (categories.map((item, index) => (
       <Option value = {
        item
      }
      key = {
        index
      } > {
        item
      } </Option>
    )))

    // const {
    //   level,
    //   categoryFirst,
    //   categorySecond
    // } = this.props

    // if (level === 'first') {
    //   return (
    //     categoryFirst.map(item => (
    //       <Option value={item.categoryFirstId} key={item.categoryFirstId}>
    //         {item.categoryName}
    //       </Option>
    //     ))
    //   )
    // } else {
    //   return (
    //     categorySecond.map(item => (
    //       <Option value={item.categorySecondId} key={item.categorySecondId}>
    //         {item.categoryName}
    //       </Option>
    //     ))
    //   )
    // }
  }

  render() {
    // const {
    //   categoryFirst,
    //   categorySecond,
    //   isFetching,
    //   level,
    //   allItem
    // } = this.props
    var categories = this.state.categories;
    var value = this.state.value;
    // const categories = level === 'first' ? categoryFirst : categorySecond

    if (categories.length === 0) {
      return (
        <Spin>
          <Select defaultValue="1" style={{ width: 120 }} allowClear disabled>
            < Option value = "1" > Getting data </Option>
          </Select>
        </Spin>
      )
    } else {
      // const defaultValue = categories.length != 0 ? categories[0] : ""
      return (
        <Select
          showSearch
          style={{ width: 150 }}
          // placeholder="请选择一个分类"
          // value={value}
          optionFilterProp="children"
          onChange={this.handleChange}
          // filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
        >
          {/* {
            allItem ? (
              <Option value="all" key={-1}>
               All
              </Option>
            ) : ""
          } */}
          {
            this.renderCategory()
          }
        </Select>
      )
    }
  }
}

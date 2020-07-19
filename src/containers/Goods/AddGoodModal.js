import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
  Button,
  message,
  Icon,
  Upload,
  Modal,
  Form,
  Input
} from 'antd';
import CategorySelector from '../../components/CategorySelector';
import goodService from '@/services/goodService';
import {
  authError,
  serviceStart,
  serviceEnd
} from '@/actions';
import { postProduct } from '../../firebase';

const FormItem = Form.Item

function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

// @connect(
//   state => ({
//     adminId: state.auth.admin.adminId,
//     token: state.auth.admin.token,
//     inService: state.service.inService
//   }),
//   dispatch => ({
//     authError: (errorMessage) => dispatch(authError(errorMessage)),
//     serviceStart: () => dispatch(serviceStart()),
//     serviceEnd: () => dispatch(serviceEnd())
//   })
// )
@Form.create()
export default class AddGoodModal extends React.Component {
  state = {
    loading: false,
    uploaded: false,
    category: 'all',
    imageUrl: '',
    file:null
  }

  beforeUpload = (file) => {
    const isJPGOrPNG = file.type === 'image/jpeg' || 'image/png';
    if (!isJPGOrPNG) {
      message.error('You can only upload JPG or PNG file!');
      return false
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
      return false
    }

    this.setState({
      uploaded: true,
      file
    })

    return false;
  }
  handleSubmit = (e) => {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      console.log(values)
      if (err) {
        return ;
      }

       postProduct(values.goodName,this.state.category,values.image.file,values.price,values.originalPrice,values.spec,values.origin);
      // postProduct
      this.props.handleCancel();
    })
  }

  // postGood = async (good) => {
  //   const {
  //     adminId,
  //     token,
  //     authError,
  //     handleSubmit,
  //     serviceStart,
  //     serviceEnd
  //   } = this.props

  //   try {
  //     serviceStart()

  //     const res = await goodService.create(
  //       adminId,
  //       token,
  //       good,
  //       good.image.file
  //     )
  //     serviceEnd()
  //     message.success("Successfully added product")
  //     handleSubmit()
  //     }
  //     catch (err) {
  //       serviceEnd()
  //       if (err.response === undefined) {
  //         const errorMessage = 'Server error, please try again later'
  //         authError(errorMessage)
  //       }
  //       if (err.response.status === 401) {
  //         const errorMessage = 'Your login has expired, please log in again'
  //         authError(errorMessage)
  //     }
  //     if (err.response.status === 400) {
  //       const errorMessage = err.response.data.message
  //       message.error(errorMessage)
  //     }
  //   }
  // }

  renderUploadButton() {
    return (
      <Button type={this.state.uploaded ? "primary" : "dashed"}>
        <Icon type={this.props.inService ? 'loading':'plus'} />
        {this.state.uploaded ? (
        'Upload successful'): (
          'upload image'
        )
        }
      </Button>
    )
  }
  handleChange = ({
    fileList
  }) => this.setState({
    fileList
  });
  priceValidator = (rule, value, callback) => {
    if (value <= 0) {
     callback('Price must be greater than 0')
    }
    callback()
  }
  categoryChange=(val) =>{
    this.setState({
      category:val
    })
  }

    handleCancel = () => this.setState({
      previewVisible: false
    });

    handlePreview = async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }

      this.setState({
        previewImage: file.url || file.preview,
        previewVisible: true,
        previewTitle: file.name || file.url.substring(file.url.lastIndexOf('/') + 1),
      });
    };

  render() {
    const {
      visible,
      handleCancel,
      form
    } = this.props

    const { getFieldDecorator } = form
    const uploadButton = this.renderUploadButton()
    // const imageUrl = this.state.imageUrl
    console.log(this.state.category);
    return (
      <Modal
        visible={visible}
        title = "New product"
        okText = "Save"
        cancelText = "Cancel"
        onCancel = {
          handleCancel
        }
        onOk = {
            this.handleSubmit
          }
          >
          <Form layout = "vertical" >
              <FormItem label = "commodity name:"> {
                getFieldDecorator('goodName', {
                  rules: [{
                    required: true,
                    message: 'Please enter the product name'
                  }, {
                    max: 20,
                    min: 1,
                    message: 'Product name cannot exceed 20 characters'
                  }]
                })( <Input type = "text" />
                )
              } 
              </FormItem>
              <FormItem label = "Product category:" > {
                getFieldDecorator('categorySecondId', {
                  rules: [{
                    required: false,
                    message: 'Please select product category'
                  }]
                })( <CategorySelector onChange={this.categoryChange} value={this.state.category} />
                )
              } 
              </FormItem> 
              <FormItem label = "Picture:" > {
                getFieldDecorator('image', {
                  rules: [{
                    required: true,
                    message: 'Please upload product images'
                  }]
                })( <Upload name = "image"
                  listType = "picture"
                  className = "avatar-uploader"
                  showUploadList = {
                    true
                  }
                  onChange = {
                    this.handleChange
                  }
                  beforeUpload = {
                    this.beforeUpload
                  }>
                  {
                    // (this.state.previewImage) ? < img style = {
                    //   {
                    //     width: '50px',
                    //     height: '50px'
                    //   }
                    // }
                    // src = {
                    //   `data:image/jpeg;base64,${this.state.previewImage}`

                    // }
                    // alt = "" / >:
                     uploadButton
                  } </Upload>
                )
              } </FormItem>
              < FormItem label = "Current Price:" > {
                getFieldDecorator('price', {
                  rules: [{
                    required: true,
                    message: 'Please enter the product price'
                  }, {
                    max: 10,
                    message: 'Price cannot exceed ten digits'
                  }, {
                    validator: this.priceValidator
                  }]
                })( <Input type = "number" />
                )
              } </FormItem>
              <FormItem label = "original price:" > {
                getFieldDecorator('originalPrice', {
                  rules: [{
                    max: 10,
                    message: 'Price cannot exceed ten digits'
                  }, {
                    validator: this.priceValidator
                  }]
                })( <Input type = "number" />
                )
              } </FormItem>
              <FormItem label = "Specifications:" > {
                getFieldDecorator('spec', {
                  rules: [{
                    required: true,
                    message: 'Please enter the product specifications'
                  }]
                })( <Input />
                )
              } </FormItem> 
              <FormItem label = "Place of Origin:" > {
            getFieldDecorator('origin', {
              rules: [{
                required: true,
                message: 'Please enter the origin of the product'
              }]
            })( <Input />
            )
          } </FormItem> 
          
          </Form>
        </Modal>
        )
        }
        }
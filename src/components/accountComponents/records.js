import React from 'react';
import Record from './record';
import * as RecordsAPI from '../../utils/RecordApi'
import RecordForm from './RecordForm'
import AmountBox from './AmountBox'

class Records extends React.Component {

  constructor() {
    super()
    this.state = {
      error: null,
      isLoad: false,
      records: []
    }

  }

  componentDidMount() {

    RecordsAPI.getAll().then(
      response => this.setState({
        records: response.data,
        isLoad: true

      })
    ).catch(
      error => this.setState({
        isLoad: false,
        error
      })
    );
  }

  /*新增记录*/
  addRecord(record) {
    this.setState({
      error: null,
      isLoad: true,
      records: [
        ...this.state.records,
        record
      ]

    })
  }

  /**
   * 更新后修改列表
   */
  updateRecord(record, data) {
    const recordIndex = this.state.records.indexOf(record)
    const newRecords = this.state.records.map((item, index) => {
      if (index != recordIndex) {
        return item
      } else {
        return data
      }
    })
    this.setState({
      records: newRecords
    });
  }


  /**
   * 删除记录
   */
  deleteRecord(record){
    const recordIndex = this.state.records.indexOf(record)
    const newRecords = this.state.records.filter((item, index) => index != recordIndex)

    this.setState({
      records : newRecords
    })


  }

  /**
   * 收入板块计数
   */
  credits() {
    let credits = this.state.records.filter((record) => {
      return record.amount >= 0

    })

    return credits.reduce((prev, curr) => {
      return prev + Number.parseInt(curr.amount,0)
    }, 0)
  }

  /**
   * 支出板块
   */
  debits(){
    let credits = this.state.records.filter((record) => {
      return record.amount <= 0

    })

    return credits.reduce((prev, curr) => {
      return prev + Number.parseInt(curr.amount,0)
    }, 0)
  }

  /**
   * 平衡
   */
  balance(){
    return this.credits() + this.debits()
  }

  render() {
    const {error, isLoad, records} = this.state;
    let recordsComponent;

    if (error) {
      recordsComponent = <div>Error : {error.message}</div>

    } else if (!isLoad) {
      recordsComponent = <div>Loading...</div>
    } else {
      recordsComponent = (

        <table className="table table-bordered">
          <thead>
          <tr>
            <th>Date</th>
            <th>Title</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
          </thead>
          <tbody>
          {records.map((record) => <Record
            key={record.id}
            record={record}
            handleEditRecord={this.updateRecord.bind(this)}
            handleDeleteRecord = {this.deleteRecord.bind(this)}
          />
          )}

          </tbody>
        </table>
      )

    }

    return (
      <div>
        <h2>Records</h2>

        <div className="row mb-3">
          <AmountBox text='Create' type='success' amount={this.credits()}/>
          <AmountBox text='Debits' type='danger' amount={this.debits()}/>
          <AmountBox text='Balance' type='info' amount={this.balance()}/>
        </div>

        <RecordForm handleNewRecord={this.addRecord.bind(this)}/>
        {recordsComponent}
      </div>
    )

  }
}

export default Records;

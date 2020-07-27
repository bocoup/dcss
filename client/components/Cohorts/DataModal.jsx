import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Header, Icon, Modal, Table } from '@components/UI';
import SplitPane from 'react-split-pane';
import Moment from '@utils/Moment';
import Media from '@utils/Media';
import Identity from '@utils/Identity';
import ContentSlide from '@components/Scenario/ContentSlide';
import './DataTable.css';
import './Resizer.css';

const DataModal = props => {
  const { index, isScenarioDataTable, prompts, rows } = props;
  const component = prompts[index];
  const { header, prompt, slide } = component;
  const ariaLabelledBy = Identity.id();
  const ariaDescribedBy = Identity.id();

  return (
    <Modal
      closeIcon
      className="dtm__view"
      size="fullscreen"
      role="dialog"
      aria-modal="true"
      aria-labelledby={ariaLabelledBy}
      aria-describedby={ariaDescribedBy}
      trigger={props.trigger}
    >
      <Header id={ariaLabelledBy} className="dtm__header">
        Responses In Context
      </Header>
      <Modal.Content id={ariaDescribedBy} scrolling className="dtm__scroll">
        <Modal.Description>
          <SplitPane split="vertical" minSize={500} defaultSize={500}>
            <div>
              <ContentSlide
                slide={slide}
                isContextual={true}
                isLastSlide={false}
                onClickBack={null}
                onClickNext={null}
                onResponseChange={null}
              />
            </div>
            <div className="dt__scroll">
              <Table celled striped selectable role="grid">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell
                      scope="col"
                      className="dt__scrollable-th"
                      colSpan={2}
                    >
                      {header || prompt}
                    </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  {rows.map((row, rowIndex) => {
                    let { 0: left = '', [index + 1]: response = {} } = row;

                    const { created_at, ended_at, value } = response;
                    const isAudioContent = Media.isAudioFile(value);
                    const { content = '' } = response;
                    const difference = Moment(ended_at).diff(created_at);
                    const duration = Moment.duration(difference).format(
                      Moment.globalFormat
                    );

                    const display = isAudioContent ? (
                      <Fragment>
                        {content && content !== response.value ? (
                          content
                        ) : (
                          <audio
                            src={`/api/media/${response.value}`}
                            controls="controls"
                          />
                        )}
                        <Icon name="microphone" />
                      </Fragment>
                    ) : (
                      content
                    );

                    const rowCells = isScenarioDataTable ? (
                      <Fragment>
                        <Table.HeaderCell verticalAlign="top">
                          <p>{left}</p>
                        </Table.HeaderCell>
                        <Table.Cell>
                          <p>{display}</p>

                          {display && (
                            <p
                              style={{
                                color: 'grey'
                              }}
                            >
                              {duration}
                            </p>
                          )}
                        </Table.Cell>
                      </Fragment>
                    ) : (
                      <Table.Cell colSpan={2}>
                        <p>{display}</p>

                        {display && (
                          <p
                            style={{
                              color: 'grey'
                            }}
                          >
                            {duration}
                          </p>
                        )}
                      </Table.Cell>
                    );

                    return (
                      <Table.Row key={`modal-${slide.id}-${rowIndex}`}>
                        {rowCells}
                      </Table.Row>
                    );
                  })}
                </Table.Body>
              </Table>
            </div>
          </SplitPane>
        </Modal.Description>
      </Modal.Content>
    </Modal>
  );
};

DataModal.propTypes = {
  isScenarioDataTable: PropTypes.bool,
  leftColVisible: PropTypes.bool,
  cells: PropTypes.array,
  onClick: PropTypes.func,
  headers: PropTypes.array,
  index: PropTypes.number,
  prompts: PropTypes.array,
  rows: PropTypes.array,
  rowKey: PropTypes.string,
  state: PropTypes.object,
  trigger: PropTypes.node
};

export default DataModal;

import * as React from 'react'
import {
  getCheckRunDisplayName,
  IRefCheck,
} from '../../lib/ci-checks/ci-checks'
import { Octicon } from '../octicons'
import { getClassNameForCheck, getSymbolForCheck } from '../branches/ci-status'
import classNames from 'classnames'
import * as OcticonSymbol from '../octicons/octicons.generated'
import { TooltippedContent } from '../lib/tooltipped-content'
import { CICheckRunActionsJobStepList } from './ci-check-run-actions-job-step-list'
import { IAPIWorkflowJobStep } from '../../lib/api'

interface ICICheckRunListItemProps {
  /** The check run to display **/
  readonly checkRun: IRefCheck

  /** Whether call for actions logs is pending */
  readonly loadingActionLogs: boolean

  /** Whether tcall for actions workflows is pending */
  readonly loadingActionWorkflows: boolean

  /** Whether to show the logs for this check run */
  readonly isCheckRunExpanded: boolean

  /** Callback for when a check run is clicked */
  readonly onCheckRunExpansionToggleClick: (checkRun: IRefCheck) => void

  /** Callback to opens check runs target url (maybe GitHub, maybe third party) */
  readonly onViewCheckDetails: (checkRun: IRefCheck) => void

  /** Callback to open a job steps link on dotcom*/
  readonly onViewJobStep: (
    checkRun: IRefCheck,
    step: IAPIWorkflowJobStep
  ) => void
}

/** The CI check list item. */
export class CICheckRunListItem extends React.PureComponent<
  ICICheckRunListItemProps
> {
  private onCheckRunClick = () => {
    this.props.onCheckRunExpansionToggleClick(this.props.checkRun)
  }

  private onViewCheckDetails = (e?: React.MouseEvent<HTMLDivElement>) => {
    e?.stopPropagation()
    this.props.onViewCheckDetails(this.props.checkRun)
  }

  private onViewJobStep = (step: IAPIWorkflowJobStep) => {
    this.props.onViewJobStep(this.props.checkRun, step)
  }

  private renderCheckStatusSymbol = (): JSX.Element => {
    const { checkRun } = this.props

    return (
      <div className="ci-check-status-symbol">
        <Octicon
          className={classNames(
            'ci-status',
            `ci-status-${getClassNameForCheck(checkRun)}`
          )}
          symbol={getSymbolForCheck(checkRun)}
        />
      </div>
    )
  }

  private rendeCheckJobStepToggle = (): JSX.Element | null => {
    const { checkRun, isCheckRunExpanded } = this.props

    if (checkRun.actionJobSteps === undefined) {
      return null
    }

    return (
      <TooltippedContent
        className="job-step-toggled-indicator"
        tooltip="Show job steps"
        tagName="div"
      >
        <div onClick={this.onCheckRunClick}>
          <Octicon
            symbol={
              isCheckRunExpanded
                ? OcticonSymbol.chevronDown
                : OcticonSymbol.chevronUp
            }
          />
        </div>
      </TooltippedContent>
    )
  }

  private renderCheckRunName = (): JSX.Element => {
    const { checkRun } = this.props
    const name = getCheckRunDisplayName(checkRun)
    return (
      <div
        className="ci-check-list-item-detail"
        onClick={this.onViewCheckDetails}
      >
        <TooltippedContent
          className="ci-check-name"
          tooltip={name}
          onlyWhenOverflowed={true}
          tagName="div"
        >
          {name}
        </TooltippedContent>

        <div className="ci-check-description">{checkRun.description}</div>
      </div>
    )
  }

  public render() {
    const { checkRun, isCheckRunExpanded } = this.props

    return (
      <>
        <div className="ci-check-list-item">
          <TooltippedContent
            className="check-run-details"
            tooltip="View online"
            tagName="div"
          >
            {this.renderCheckStatusSymbol()}
            {this.renderCheckRunName()}
          </TooltippedContent>
          {this.rendeCheckJobStepToggle()}
        </div>
        {isCheckRunExpanded && checkRun.actionJobSteps !== undefined ? (
          <CICheckRunActionsJobStepList
            steps={checkRun.actionJobSteps}
            onViewJobStep={this.onViewJobStep}
          />
        ) : null}
      </>
    )
  }
}

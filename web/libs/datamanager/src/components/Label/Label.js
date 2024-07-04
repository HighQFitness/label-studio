import { inject } from "mobx-react";
import { observer } from "mobx-react-lite";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FaArrowDown, FaArrowUp, FaCaretDown, FaChevronLeft, FaColumns } from "react-icons/fa";
import { Block, Elem } from "../../utils/bem";
import { FF_DEV_1170, isFF } from "../../utils/feature-flags";
import { Button } from "../Common/Button/Button";
import { FieldsButton } from "../Common/FieldsButton";
import { Icon } from "../Common/Icon/Icon";
import { Resizer } from "../Common/Resizer/Resizer";
import { Space } from "../Common/Space/Space";
import { DataView } from "../MainView";
import "./Label.styl";
import { Tooltip } from "../Common/Tooltip/Tooltip";
import { IconArrowLeft, IconArrowRight } from "../../assets/icons";
import AthleteWODInfo from "../../../../editor/src/components/AthleteWODInfo/AthleteWODInfo";

const LabelingHeader = ({ SDK, onClick, isExplorerMode }) => {
  return (
    <Elem name="header" mod={{ labelStream: !isExplorerMode }}>
      <Space size="large">
        {SDK.interfaceEnabled("backButton") && (
          <Button
            icon={<FaChevronLeft style={{ marginRight: 4, fontSize: 16 }} />}
            type="link"
            onClick={onClick}
            style={{ fontSize: 18, padding: 0, color: "black" }}
          >
            Back
          </Button>
        )}

        {isExplorerMode ? (
          <FieldsButton
            wrapper={FieldsButton.Checkbox}
            icon={<Icon icon={FaColumns} />}
            trailingIcon={<Icon icon={FaCaretDown} />}
            title={"Fields"}
          />
        ) : null}
      </Space>
    </Elem>
  );
};

const injector = inject(({ store }) => {
  return {
    store,
    loading: store?.loadingData,
  };
});

/**
 * @param {{store: import("../../stores/AppStore").AppStore}} param1
 */
export const Labeling = injector(observer(({
  store,
  loading,
}) => {
  const shouldShowTaskTable = true; //window.localStorage.getItem('showTaskTable')?.toLocaleLowerCase() === 'true';

  const lsfRef = useRef();
  const SDK = store?.SDK;
  const view = store?.currentView;
  const { isExplorerMode } = store;

  const [collapseTable, setCollapseTable] = useState(shouldShowTaskTable);

  const toggleCollapseTaskTable = () => {
    const flag = !collapseTable;
    window.localStorage.setItem('showTaskTable', `${flag}`);
    setCollapseTable(flag);
  };

  const isLabelStream = useMemo(() => {
    return SDK.mode === 'labelstream';
  }, []);

  const closeLabeling = useCallback(() => {
    store.closeLabeling();
  }, [store]);

  const initLabeling = useCallback(() => {
    if (!SDK.lsf) SDK.initLSF(lsfRef.current);
    SDK.startLabeling();
  }, []);

  useEffect(() => {
    if (!isLabelStream) SDK.on("taskSelected", initLabeling);

    return () => {
      if (!isLabelStream) SDK.off("taskSelected", initLabeling);
    };
  }, []);

  useEffect(() => {
    if (!SDK.lsf && store.dataStore.selected || isLabelStream) {
      initLabeling();
    }
  }, []);

  useEffect(() => {
    return () => SDK.destroyLSF();
  }, []);

  const onResize = useCallback((width) => {
    view.setLabelingTableWidth(width);
    // trigger resize events inside LSF
    window.dispatchEvent(new Event("resize"));
  }, []);

  const outlinerEnabled = isFF(FF_DEV_1170);

  return (
    <Block name="label-view" mod={{ loading }}>
      {SDK.interfaceEnabled("labelingHeader") && (
        <LabelingHeader
          SDK={SDK}
          onClick={closeLabeling}
          isExplorerMode={isExplorerMode}
        />
      )}

      <Elem name="content" style={{ position: 'relative' }}>
        {/* <div
          style={{
            position: 'absolute',
            top: -3,
            left: 2,
            width: 20,
            height: 20,
            border: `1px solid black`,
            borderRadius: '50%',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            cursor: 'pointer',
            backgroundColor: 'white',
            zIndex: 9999
          }}
        >
          <Tooltip title={collapseTable ? 'Show Task Table' : 'Hide Task Table'}>
            {
              collapseTable ?
              <IconArrowRight onClick={toggleCollapseTaskTable}/> :
              <IconArrowLeft onClick={toggleCollapseTaskTable}/>
            }
          </Tooltip>
        </div> */}
        <div style={{ height: '100%', backgroundColor: 'white'}}>
          {(isExplorerMode && !collapseTable) && (
            <Elem name="table" style={{ height: '60%', maxHeight: 600 }} >
              <Elem
                tag={Resizer}
                name="dataview"
                minWidth={200}
                showResizerLine={false}
                type={'quickview'}
                maxWidth={window.innerWidth * 0.35}
                initialWidth={view.labelingTableWidth} // hardcoded as in main-menu-trigger
                onResizeFinished={onResize}
                style={{ display: "flex", flex: 1, width: '100%'}}
              >
                <DataView />
              </Elem>
            </Elem>
          )}
          <div style={{ margin: '1rem auto', position: 'relative' }}>
            <div
              style={{
                position: 'absolute',
                top: -8,
                left: 3,
                width: 20,
                height: 20,
                border: `1px solid black`,
                borderRadius: '50%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer',
                backgroundColor: 'white',
                zIndex: 9999
              }}
            >
              <Tooltip title={collapseTable ? 'Show Task Table' : 'Hide Task Table'}>
                {
                  collapseTable ?
                  <FaArrowDown onClick={toggleCollapseTaskTable}/> :
                  <FaArrowUp onClick={toggleCollapseTaskTable}/>
                }
              </Tooltip>
            </div>
            <AthleteWODInfo
              athleteName={'John Doe'}
              wod={'5 rounds for time\n 3 bar muscle up\n10 deadlifts (135/95 lbs)'}
            />
          </div>
        </div>

        <Elem name="lsf-wrapper" mod={{ mode: isExplorerMode ? "explorer" : "labeling" }}>
          {loading && <Elem name="waiting" mod={{ animated: true }}/>}
          <Elem
            ref={lsfRef}
            id="label-studio-dm"
            name="lsf-container"
            key="label-studio"
            mod={{ outliner: outlinerEnabled }}
          />
        </Elem>
      </Elem>
    </Block>
  );
}));

import styled from "styled-components";

export const Control = styled.div`
  font-family: "Lato", Arial;
  position: relative;
  transition: width 1s;

  width: 35%;
  ${props =>
    props.isActive &&
    `
    ${ControlList} {
      display: block;
    }
    ${Trigger} {
      border-radius: 2px 2px 0 0;
    }
  `};
  @media screen and (max-width: 1300px) {
    width: 60% !important;
  }
  @media screen and (max-width: 992px) {
    width: 100% !important;
  }
`;

export const ControlField = styled.div`
  position: relative;
  background-color: white;
  border: 1px solid hsl(0, 0%, 70%);
  border-radius: 3px;
  width: 100%;
`;
export const ControlList = styled.ul`
  box-sizing: border-box;
  background: #fff;
  border-radius: 5px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.2);
  display: none;
  max-height: 240px;
  margin: 0;
  overflow-y: auto;
  padding: 0px;
  position: absolute;
  width: 100%;
  z-index: 100;
  &:focus {
    width: 100%;
    outline: 0;
  }
  ${props =>
    props.up && props.options > 6
      ? `top: -244px;`
      : props.up && props.options <= 6
      ? `top: -${props.options * 40 + 4}px;`
      : `top: 44px;`}
  ${props =>
    props.isActive &&
    !props.isSelected &&
    `
    background-color:#B8D1FB;`}
  ${props => props.rf && `display:none !important;`}
`;

export const ListItem = styled.li`
  color: black;
  height: 40px;
  list-style: none;
  margin: 0px;
  padding: 10px 10px;
  position: relative;
  white-space: nowrap;
  overflow: hidden;
  text-align: center;
  text-overflow: ellipsis;

  ${props =>
    props.isActive &&
    !props.isSelected &&
    `
    background-color:#B8D1FB;`}
 
     ${props =>
       props.colorEffect &&
       `
       background-color:#B8D1FB !important;`}   
  ${props =>
    props.isSelected &&
    `  color:white; background-color:rgb(0, 92, 158) !important;`}
`;
export const Trigger = styled.div``;
export const AutoComplete = styled.input`
  color: black;
  font-weight: 500;
  background-color: transparent;
  box-sizing: border-box;
  border: none;
  display: block;
  font-size: 16px;
  margin-bottom: 0;
  min-height: 40px;
  overflow: hidden;
  padding: 2px 40px 2px 0.5rem;
  position: relative;
  width: 100%;
  white-space: nowrap;
  text-align: left;
  text-overflow: ellipsis;
  &::placeholder {
    color: black;
  }
  &::-moz-placeholder {
    color: black;
    opacity: 1;
  }
  &:focus {
    width: 100%;
    outline: 0;
    box-shadow: rgba(8, 132, 252, 0.3) 0px 0px 0px 3px;
    z-index: 1;
  }
`;
export const TriggerIcon = styled.span`
  background-color: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  bottom: 0;
  right: 0;
  width: 40px;
  &:after {
    content: "";
    width: 8px;
    height: 8px;

    transform: rotate(45deg);
    border-bottom: 2px solid black;
    border-right: 2px solid black;
  }
`;

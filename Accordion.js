import React, {
  Component,
  PropTypes,
} from 'react';

import {
  View,
  TouchableHighlight,
} from 'react-native';

import Collapsible from './Collapsible';

const COLLAPSIBLE_PROPS = Object.keys(Collapsible.propTypes);
const VIEW_PROPS = Object.keys(View.propTypes);

class Accordion extends Component {
  static propTypes = {
    sections: PropTypes.array.isRequired,
    renderHeader: PropTypes.func.isRequired,
    renderContent: PropTypes.func.isRequired,
    onChange: PropTypes.func,
    align: PropTypes.oneOf(['top', 'center', 'bottom']),
    duration: PropTypes.number,
    easing: PropTypes.string,
    initiallyActiveSections: PropTypes.arrayOf(PropTypes.number),
    activeSections: PropTypes.oneOfType([
      PropTypes.bool, // if false, closes all sections
      PropTypes.arrayOf(PropTypes.number), // sets index of section to open
    ]),
    underlayColor: PropTypes.string,
    Touchable: PropTypes.instanceOf(Component),
  };

  static defaultProps = {
    underlayColor: 'black',
    Touchable: TouchableHighlight,
  };

  constructor(props) {
    super(props);

    // if activeSection not specified, default to initiallyActiveSection
    this.state = {
      activeSections: props.activeSections !== undefined
        ? props.activeSections
        : props.initiallyActiveSections,
    };
  }

  _toggleSection(section) {
    const activeSections = [...this.state.activeSections];
    const isSectionActive = activeSections.findIndex((activeSection) => section === activeSection) !== -1;
    isSectionActive
      ? activeSections.splice(
          activeSections.findIndex((activeSection) => section === activeSection),
          1
      )
      : activeSections.push(section);

    if (this.props.activeSections === undefined) {
      this.setState({ activeSections });
    }
    if (this.props.onChange) {
      this.props.onChange(activeSections);
    }
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.activeSections !== undefined) {
      this.setState({
        activeSections: nextProps.activeSections,
      });
    }
  }

  render() {
    let viewProps = {};
    let collapsibleProps = {};
    Object.keys(this.props).forEach((key) => {
      if (COLLAPSIBLE_PROPS.indexOf(key) !== -1) {
        collapsibleProps[key] = this.props[key];
      } else if (VIEW_PROPS.indexOf(key) !== -1) {
        viewProps[key] = this.props[key];
      }
    });

    const { Touchable } = this.props;

    return (
      <View {...viewProps}>
      {this.props.sections.map((section, key) => {
        const isSectionActive = this.state.activeSections.findIndex((activeSection) => key === activeSection) !== -1;
        return (
          <View key={key}>
            <Touchable onPress={() => this._toggleSection(key)} underlayColor={this.props.underlayColor}>
              {this.props.renderHeader(section, key, isSectionActive)}
            </Touchable>
            <Collapsible collapsed={!isSectionActive} {...collapsibleProps}>
              {this.props.renderContent(section, key, isSectionActive)}
            </Collapsible>
          </View>
        );
      })}
      </View>
    );
  }
}

module.exports = Accordion;

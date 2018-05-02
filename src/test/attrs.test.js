// @flow
import React from 'react'
import { shallow, mount } from 'enzyme'

import { resetStyled, expectCSSMatches } from './utils'

let styled

describe('attrs', () => {
  beforeEach(() => {
    styled = resetStyled()
  })

  it('work fine with an empty object', () => {
    const Comp = styled.div.attrs({})``
    expect(shallow(<Comp />).html()).toEqual('<div class="sc-a b"></div>')
  })

  it('pass a simple attr', () => {
    const Comp = styled.button.attrs({
      type: 'button'
    })``
    expect(shallow(<Comp />).html()).toEqual('<button type="button" class="sc-a b"></button>')
  })

  it('call an attr function', () => {
    const Comp = styled.button.attrs({
      type: () => 'button'
    })``
    expect(shallow(<Comp />).html()).toEqual('<button type="button" class="sc-a b"></button>')
  })

  it('pass props to the attr function', () => {
    const Comp = styled.button.attrs({
      type: props => props.submit ? 'submit' : 'button'
    })``
    expect(shallow(<Comp />).html()).toEqual('<button type="button" class="sc-a b"></button>')
    expect(shallow(<Comp submit/>).html()).toEqual('<button type="submit" class="sc-a b"></button>')
  })

  it('should replace attrs with props', () => {
    const Comp = styled.button.attrs({
      type: props => props.submit ? 'submit' : 'button',
      tabIndex: 0
    })``
    expect(shallow(<Comp />).html()).toEqual(
      '<button type="button" tabindex="0" class="sc-a b"></button>'
    )
    expect(shallow(<Comp type="reset"/>).html()).toEqual(
      '<button type="reset" tabindex="0" class="sc-a b"></button>'
    )
    expect(shallow(<Comp type="reset" tabIndex="-1"/>).html()).toEqual(
      '<button type="reset" tabindex="-1" class="sc-a b"></button>'
    )
  })

  it('should merge className', () => {
    const Comp = styled.div.attrs({
      className: 'meow nya',
    })``
    expect(shallow(<Comp />).html()).toEqual(
      '<div class="sc-a meow nya b"></div>'
    )
  })

  it('should merge className even if its a function', () => {
    const Comp = styled.div.attrs({
      className: props => `meow ${ props.purr ? 'purr' : 'nya' }`,
    })``
    expect(shallow(<Comp />).html()).toEqual(
      '<div class="sc-a meow nya b"></div>'
    )
    expect(shallow(<Comp purr/>).html()).toEqual(
      '<div class="sc-a meow purr b"></div>'
    )
  })

  it('should work with data and aria attributes', () => {
    const Comp = styled.div.attrs({
      'data-foo': 'bar',
      'aria-label': 'A simple FooBar'
    })``
    expect(shallow(<Comp />).html()).toEqual('<div data-foo="bar" aria-label="A simple FooBar" class="sc-a b"></div>')
  })

  it('merge attrs', () => {
    const Comp = styled.button.attrs({
      type: 'button',
      tabIndex: 0
    }).attrs({
      type: 'submit'
    })``
    expect(shallow(<Comp />).html()).toEqual('<button type="submit" tabindex="0" class="sc-a b"></button>')
  })

  it('merge attrs when inheriting SC', () => {
    const Parent = styled.button.attrs({
      type: 'button',
      tabIndex: 0
    })``
    const Child = Parent.extend.attrs({
      type: 'submit'
    })``
    expect(shallow(<Child />).html()).toEqual('<button type="submit" tabindex="0" class="sc-b c"></button>')
  })

  it('pass attrs to style block', () => {
    /* Would be a React Router Link in real life */
    const Comp = styled.a.attrs({
      href: '#',
      'data-active-class-name': '--is-active'
    })`
      color:blue;
      &.${props => props['data-active-class-name']} {
        color:red;
      }
    `
    expect(shallow(<Comp />).html()).toEqual('<a href="#" data-active-class-name="--is-active" class="sc-a b"></a>')
    expectCSSMatches('.sc-a {} .b { color:blue; } .b.--is-active { color:red; }')
  })

  it('should pass through children as a normal prop', () => {
    const Comp = styled.div.attrs({
      children: 'Probably a bad idea'
    })``
    expect(shallow(<Comp />).html()).toEqual('<div class="sc-a b">Probably a bad idea</div>')
  })

  it('should pass through complex children as well', () => {
    const Comp = styled.div.attrs({
      children: <span>Probably a bad idea</span>
    })``
    expect(shallow(<Comp />).html()).toEqual('<div class="sc-a b"><span>Probably a bad idea</span></div>')
  })

  it('should override children of course', () => {
    const Comp = styled.div.attrs({
      children: <span>Amazing</span>
    })``
    expect(shallow(<Comp>Something else</Comp>).html()).toEqual('<div class="sc-a b">Something else</div>')
  })

  it('should pass through callback ref', () => {
    const ref = jest.fn()
    const Comp = styled.div.attrs({
      ref: () => ref
    })``
    const wrapper = mount(<Comp />)
    const div = wrapper.find('div').first()
    expect(div).toBeTruthy()
    expect(ref).toHaveBeenCalledWith(div.instance())
  })

  it('should pass through object ref', () => {
    const ref = React.createRef()
    const Comp = styled.div.attrs({
      ref: () => ref
    })``
    const wrapper = mount(<Comp />)
    const div = wrapper.find('div').first()
    expect(div).toBeTruthy()
    expect(ref).toHaveProperty('current', div.instance())
  })

  it('should pass through callback ref through inner styled component', () => {
    const ref = jest.fn()
    const Inner = styled.div``;
    const Comp = styled(Inner).attrs({
      ref: () => ref
    })``
    const wrapper = mount(<Comp />)
    const div = wrapper.find('div').first()
    expect(div).toBeTruthy()
    expect(ref).toHaveBeenCalledWith(div.instance())
  })

  it('should pass through object ref through inner styled component', () => {
    const ref = React.createRef()
    const Inner = styled.div``;
    const Comp = styled(Inner).attrs({
      ref: () => ref
    })``
    const wrapper = mount(<Comp />)
    const div = wrapper.find('div').first()
    expect(div).toBeTruthy()
    expect(ref).toHaveProperty('current', div.instance())
  })
})

test('enzyme should mount object refs', () => {
  const ref = React.createRef()
  const wrapper = mount(<div ref={ref} />)
  const div = wrapper.find('div').first()
  expect(div).toBeTruthy()
  expect(ref).toHaveProperty('current', div.instance())
})

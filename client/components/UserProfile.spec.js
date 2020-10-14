/* global describe beforeEach it */

import {expect} from 'chai'
import React from 'react'
import enzyme, {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {userProfile} from './UserProfile'

const adapter = new Adapter()
enzyme.configure({adapter})

// describe('userProfile', () => {
//   let userProfile

//   beforeEach(() => {
//     userProfile = shallow(<userProfile email="cody@email.com" />)
//   })

//   it('renders the email in an h3', () => {
//     expect(userProfile.find('h3').text()).to.be.equal('Welcome, cody@email.com')
//   })
// })

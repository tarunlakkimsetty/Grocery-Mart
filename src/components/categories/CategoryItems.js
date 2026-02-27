import React from 'react';
import { SidebarItem } from '../../styledComponents/SidebarStyles';

class CategoryGrains extends React.Component {
    render() {
        const { active, onClick } = this.props;
        return (
            <SidebarItem $active={active} onClick={() => onClick('grains')}>
                <span className="item-icon">🌾</span>
                <span className="item-label">Grains, Rice & Pulses</span>
            </SidebarItem>
        );
    }
}

class CategoryMilk extends React.Component {
    render() {
        const { active, onClick } = this.props;
        return (
            <SidebarItem $active={active} onClick={() => onClick('milk')}>
                <span className="item-icon">🥛</span>
                <span className="item-label">Milk & Dairy</span>
            </SidebarItem>
        );
    }
}

class CategorySnacks extends React.Component {
    render() {
        const { active, onClick } = this.props;
        return (
            <SidebarItem $active={active} onClick={() => onClick('snacks')}>
                <span className="item-icon">🍿</span>
                <span className="item-label">Snacks</span>
            </SidebarItem>
        );
    }
}

class CategorySpices extends React.Component {
    render() {
        const { active, onClick } = this.props;
        return (
            <SidebarItem $active={active} onClick={() => onClick('spices')}>
                <span className="item-icon">🌶️</span>
                <span className="item-label">Spices</span>
            </SidebarItem>
        );
    }
}

class CategoryOils extends React.Component {
    render() {
        const { active, onClick } = this.props;
        return (
            <SidebarItem $active={active} onClick={() => onClick('oils')}>
                <span className="item-icon">🫗</span>
                <span className="item-label">Oils</span>
            </SidebarItem>
        );
    }
}

class CategoryCondiments extends React.Component {
    render() {
        const { active, onClick } = this.props;
        return (
            <SidebarItem $active={active} onClick={() => onClick('condiments')}>
                <span className="item-icon">🍅</span>
                <span className="item-label">Condiments</span>
            </SidebarItem>
        );
    }
}

class CategoryCleaning extends React.Component {
    render() {
        const { active, onClick } = this.props;
        return (
            <SidebarItem $active={active} onClick={() => onClick('cleaning')}>
                <span className="item-icon">🧹</span>
                <span className="item-label">Cleaning Supplies</span>
            </SidebarItem>
        );
    }
}

class CategoryPersonalCare extends React.Component {
    render() {
        const { active, onClick } = this.props;
        return (
            <SidebarItem $active={active} onClick={() => onClick('personal')}>
                <span className="item-icon">🧴</span>
                <span className="item-label">Personal Care & Hygiene</span>
            </SidebarItem>
        );
    }
}

export {
    CategoryGrains,
    CategoryMilk,
    CategorySnacks,
    CategorySpices,
    CategoryOils,
    CategoryCondiments,
    CategoryCleaning,
    CategoryPersonalCare,
};

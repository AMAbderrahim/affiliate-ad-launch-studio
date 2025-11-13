import React from 'react';
import { useLocation } from 'react-router-dom';
import { useCampaign } from '../context/CampaignContext';
import { useAuth } from '../context/AuthContext';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger 
} from './ui/dropdown-menu';
import { Bell, Settings, User, DollarSign, TrendingUp, Activity, LogOut } from 'lucide-react';

const PAGE_TITLES: Record<string, string> = {
  '/data-hub': 'Campaign Setup',
  '/marketing-strategist': 'Marketing Strategy',
  '/creative-strategist': 'Creative Strategy',
  '/video-director': 'Video Production',
  '/designer': 'Design Studio',
  '/prompt-generator': 'AI Prompt Generator',
  '/copywriter': 'Copy Studio',
  '/media-buyer': 'Media Buying',
  '/data-ops': 'Data & Analytics',
  '/compliance': 'Compliance Review',
  '/competitor-analysis': 'Competitor Analysis',
  '/campaign-scheduler': 'Campaign Scheduler',
  '/weekly-reports': 'Reports & Analytics'
};

export function Header() {
  const location = useLocation();
  const { campaign } = useCampaign();
  const { user, logout } = useAuth();
  
  const pageTitle = PAGE_TITLES[location.pathname] || 'Affiliate Ad Studio';

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Page Title */}
        <div>
          <h1 className="text-2xl text-gray-900">{pageTitle}</h1>
          {campaign && (
            <p className="text-sm text-gray-500 mt-0.5">
              Campaign: <span className="text-gray-700">{campaign.name}</span>
            </p>
          )}
        </div>

        {/* Campaign Stats & Actions */}
        <div className="flex items-center space-x-4">
          {campaign && (
            <>
              <div className="flex items-center space-x-4 px-4 py-2 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex items-center space-x-2">
                  <DollarSign className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Daily Budget</p>
                    <p className="text-sm">${campaign.budget.daily}</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-300" />
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Target CPA</p>
                    <p className="text-sm">${campaign.goals.target_cpa || 'N/A'}</p>
                  </div>
                </div>
                <div className="w-px h-8 bg-gray-300" />
                <div className="flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-gray-500" />
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <Badge variant="secondary" className="text-xs">
                      {campaign.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full"></span>
            </Button>
            
            {/* User Menu */}
            {user && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={user.picture} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="text-left hidden md:block">
                      <p className="text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} className="text-red-600">
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

import NewTeamMemberForm from '@/component/team/forms/NewTeamMemberForm';

export const metadata = {
  title: 'Add Team Member | Disibin Management',
  description: 'Create a new team member account and send an invitation email.',
};

const NewTeamMemberPage = () => {
  return <NewTeamMemberForm />;
};

export default NewTeamMemberPage;

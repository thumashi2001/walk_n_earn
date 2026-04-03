function Home() {
  const user = JSON.parse(localStorage.getItem("walknEarnUser"));

  return (
    <div>
      <h2>Welcome to Walk n Earn</h2>
      <p>This is the home screen.</p>
      {user && (
        <div>
          <p><strong>Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Points:</strong> {user.totalPoints}</p>
        </div>
      )}
    </div>
  );
}

export default Home;
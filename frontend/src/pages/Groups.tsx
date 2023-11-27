import React from "react";
import { useParams } from "react-router-dom";
import { groups } from "@/mockdata";

type Props = {};

const Groups = (props: Props) => {
  const { groupId } = useParams();
  const group = groups.find((g) => g.id === groupId);
  return (
    <div>
      {group ? (
        <div>
          <h2>{group.name}</h2>
          <p>{group.info}</p>
        </div>
      ) : (
        <p>Group not found</p>
      )}
    </div>
  );
};

export default Groups;
